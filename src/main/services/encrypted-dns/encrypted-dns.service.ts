import sudo from '@vscode/sudo-prompt'
import type { ActiveEncryptedConnection } from '../../../shared/interfaces/encrypted-dns.interface'
import type { Server } from '../../../shared/interfaces/server.interface'
import {
	getServerProtocol,
	isEncryptedDns,
} from '../../../shared/interfaces/server.interface'
import type { Platform } from '../../platforms/platform'
import { userLogger } from '../../shared/logger'
import { store } from '../../store/store'
import { LocalDnsProxy } from './local-dns-proxy'

const LOCAL_STUB = '127.0.0.1'

function execElevated(cmd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		sudo.exec(cmd, { name: 'dnsChanger' }, (error, stdout) => {
			if (error) {
				reject(error)
				return
			}
			resolve(String(stdout ?? ''))
		})
	})
}

/**
 * Applies DoH / DoT using OS-native APIs when available, otherwise a local
 * UDP stub on 127.0.0.1:53 that forwards to the encrypted upstream.
 */
export class EncryptedDnsService {
	private proxy: LocalDnsProxy | null = null

	constructor(private platform: Platform) {}

	getActiveConnection(): ActiveEncryptedConnection | null {
		return store.get('activeEncryptedConnection') || null
	}

	async connect(server: Server): Promise<void> {
		const protocol = getServerProtocol(server)
		if (protocol !== 'doh' && protocol !== 'dot') {
			throw new Error('Server is not configured for encrypted DNS')
		}

		await this.disconnect({ restoreSystemDns: false })

		if (protocol === 'doh' && process.platform === 'win32') {
			await this.connectWindowsDoh(server)
			return
		}

		if (protocol === 'dot' && process.platform === 'linux') {
			const usedNative = await this.tryConnectLinuxDot(server)
			if (usedNative) return
		}

		await this.connectViaProxy(server)
	}

	async disconnect(options?: { restoreSystemDns?: boolean }): Promise<void> {
		const restoreSystemDns = options?.restoreSystemDns !== false
		const active = this.getActiveConnection()

		if (this.proxy) {
			try {
				await this.proxy.stop()
			} catch (error) {
				userLogger.error(
					error instanceof Error ? error.stack : String(error),
					'Failed to stop local DNS proxy'
				)
			}
			this.proxy = null
		}

		if (active?.mode === 'native' && process.platform === 'win32') {
			await this.clearWindowsDoh(active.bootstrap)
		}

		if (active?.mode === 'native' && process.platform === 'linux') {
			await this.clearLinuxDot()
		}

		store.set('activeEncryptedConnection', null)

		if (restoreSystemDns) {
			await this.platform.clearDns()
		}
	}

	private async connectWindowsDoh(server: Server): Promise<void> {
		const bootstrap = (server.servers || []).filter(Boolean)
		if (!bootstrap.length) {
			await this.connectViaProxy(server)
			return
		}

		const template = server.dohUrl || `https://${this.hostFromDoh(server)}/dns-query`
		const dothost = this.hostFromUrlOrDot(template, server.dotHost)

		for (const ip of bootstrap) {
			const cmd = `netsh dns add encryption server=${ip} dothost=${dothost} autoupgrade=yes dohtemplate=${template}`
			try {
				await execElevated(cmd)
			} catch (error) {
				userLogger.error(
					error instanceof Error ? error.stack : String(error),
					`Windows DoH encryption register failed for ${ip}`
				)
			}
		}

		await this.platform.setDns(bootstrap)

		store.set('activeEncryptedConnection', {
			key: server.key,
			protocol: 'doh',
			mode: 'native',
			dohUrl: template,
			bootstrap,
		})
	}

	private async clearWindowsDoh(bootstrap: string[]): Promise<void> {
		for (const ip of bootstrap) {
			try {
				await execElevated(`netsh dns delete encryption server=${ip}`)
			} catch {
				// ignore missing encryption records
			}
		}
	}

	private async tryConnectLinuxDot(server: Server): Promise<boolean> {
		const bootstrap = (server.servers || []).filter(Boolean)
		const host = server.dotHost
		if (!bootstrap.length || !host) return false

		try {
			const nmCheck = await execElevated(
				'command -v nmcli >/dev/null 2>&1 && echo yes || echo no'
			)
			if (!nmCheck.trim().includes('yes')) return false

			const connOut = await execElevated(
				'nmcli -t -f NAME,DEVICE,TYPE con show --active | head -n1'
			)
			const connName = connOut.trim().split(':')[0]
			if (!connName) return false

			const quoted = connName.replace(/'/g, `'\\''`)
			const dns = bootstrap.join(' ')
			await execElevated(
				`nmcli con mod '${quoted}' ipv4.dns '${dns}' ipv4.ignore-auto-dns yes connection.dns-over-tls 2 && nmcli con up '${quoted}'`
			)

			try {
				await execElevated(
					`IFACE=$(ip -4 route show default | awk '{print $5}' | head -n1); resolvectl dns "$IFACE" ${bootstrap[0]}#${host}; resolvectl dnsovertls "$IFACE" yes`
				)
			} catch {
				// optional SNI path
			}

			store.set('activeEncryptedConnection', {
				key: server.key,
				protocol: 'dot',
				mode: 'native',
				dotHost: host,
				bootstrap,
			})
			return true
		} catch (error) {
			userLogger.error(
				error instanceof Error ? error.stack : String(error),
				'Linux native DoT failed; falling back to local proxy'
			)
			return false
		}
	}

	private async clearLinuxDot(): Promise<void> {
		try {
			const connOut = await execElevated(
				'nmcli -t -f NAME con show --active 2>/dev/null | head -n1 || true'
			)
			const connName = connOut.trim()
			if (!connName) return
			const quoted = connName.replace(/'/g, `'\\''`)
			await execElevated(
				`nmcli con mod '${quoted}' connection.dns-over-tls 0 ipv4.dns "" ipv4.ignore-auto-dns no && nmcli con up '${quoted}'`
			)
		} catch {
			// clearDns() will still run
		}
	}

	private async connectViaProxy(server: Server): Promise<void> {
		const protocol = getServerProtocol(server)
		if (protocol !== 'doh' && protocol !== 'dot') {
			throw new Error('Invalid encrypted protocol')
		}

		const upstream =
			protocol === 'doh'
				? { kind: 'doh' as const, url: server.dohUrl! }
				: {
						kind: 'dot' as const,
						host: server.dotHost!.split(':')[0],
						port: server.dotHost!.includes(':')
							? Number(server.dotHost!.split(':')[1])
							: 853,
						servername: server.dotHost!.split(':')[0],
					}

		const proxy = new LocalDnsProxy(upstream, {
			host: LOCAL_STUB,
			port: 53,
		})

		try {
			await proxy.start()
		} catch (error: any) {
			if (error?.code === 'EACCES' || error?.code === 'EADDRINUSE') {
				throw new Error(
					'Could not bind 127.0.0.1:53 for encrypted DNS. Close other local DNS stubs or run the app with elevated privileges.'
				)
			}
			throw error
		}

		this.proxy = proxy
		await this.platform.setDns([LOCAL_STUB])

		store.set('activeEncryptedConnection', {
			key: server.key,
			protocol,
			mode: 'proxy',
			dohUrl: server.dohUrl,
			dotHost: server.dotHost,
			bootstrap: [LOCAL_STUB],
		})
	}

	private hostFromDoh(server: Server): string {
		if (server.dotHost) return server.dotHost.split(':')[0]
		if (server.dohUrl) {
			try {
				return new URL(server.dohUrl).hostname
			} catch {
				return 'dns.example'
			}
		}
		return 'dns.example'
	}

	private hostFromUrlOrDot(url: string, dotHost?: string): string {
		if (dotHost) return dotHost.split(':')[0]
		try {
			return new URL(url).hostname
		} catch {
			return 'dns.example'
		}
	}
}

export function assertEncryptedServer(server: Server): void {
	if (!isEncryptedDns(server)) return
	const protocol = getServerProtocol(server)
	if (protocol === 'doh' && !server.dohUrl) {
		throw new Error('DoH URL is required')
	}
	if (protocol === 'dot' && !server.dotHost) {
		throw new Error('DoT hostname is required')
	}
}
