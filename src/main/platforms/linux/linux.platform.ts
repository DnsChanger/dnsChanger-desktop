import * as os from 'node:os'
import { store } from '../../store/store'
import { Platform } from '../platform'
import type { Interface } from '../windows/interfaces/interface'
import {
	type LinuxConnection,
	type LinuxDnsBackend,
	RESOLV_BACKUP_PATH,
	commandExists,
	detectLinuxDnsBackend,
	getDefaultRouteInterface,
	listIpDevices,
	listNmConnections,
	listNmDevices,
	parseIpv4DnsList,
	pickPreferredConnection,
	runUserCmd,
	shellQuote,
} from './linux-dns.util'

export class LinuxPlatform extends Platform {
	private backend: LinuxDnsBackend | null = null

	private async getBackend(): Promise<LinuxDnsBackend> {
		if (!this.backend) {
			this.backend = await detectLinuxDnsBackend()
		}
		return this.backend
	}

	/** Force re-detect on next call (e.g. after backend command failures). */
	private resetBackend() {
		this.backend = null
	}

	private getConfiguredInterface(): string {
		return store.get('settings').network_interface || 'Auto'
	}

	private async resolveNmConnection(): Promise<LinuxConnection> {
		const connections = await listNmConnections()
		if (!connections.length) {
			throw new Error('No active NetworkManager connection found')
		}

		const configured = this.getConfiguredInterface()
		if (configured && configured !== 'Auto') {
			const byDevice = connections.find((c) => c.device === configured)
			if (byDevice) return byDevice

			const byName = connections.find((c) => c.name === configured)
			if (byName) return byName
		}

		const preferred = pickPreferredConnection(connections)
		if (!preferred) throw new Error('No active NetworkManager connection found')
		return preferred
	}

	private async resolveDeviceName(): Promise<string> {
		const configured = this.getConfiguredInterface()
		if (configured && configured !== 'Auto') return configured

		const defaultIface = await getDefaultRouteInterface()
		if (defaultIface) return defaultIface

		const devices = await listIpDevices()
		if (devices[0]?.device) return devices[0].device

		throw new Error('No network interface found')
	}

	async setDns(nameServers: Array<string>): Promise<void> {
		const servers = nameServers.filter(Boolean)
		if (!servers.length) throw new Error('No DNS servers provided')

		const backend = await this.getBackend()

		try {
			if (backend === 'networkmanager') {
				await this.setDnsNetworkManager(servers)
				return
			}
			if (backend === 'systemd-resolved') {
				await this.setDnsSystemdResolved(servers)
				return
			}
			await this.setDnsResolvConf(servers)
		} catch (error) {
			// One retry with fresh detection if the cached backend is stale
			this.resetBackend()
			const next = await this.getBackend()
			if (next === backend) throw error

			if (next === 'networkmanager') {
				await this.setDnsNetworkManager(servers)
			} else if (next === 'systemd-resolved') {
				await this.setDnsSystemdResolved(servers)
			} else {
				await this.setDnsResolvConf(servers)
			}
		}
	}

	async clearDns(): Promise<void> {
		const backend = await this.getBackend()

		try {
			if (backend === 'networkmanager') {
				await this.clearDnsNetworkManager()
				return
			}
			if (backend === 'systemd-resolved') {
				await this.clearDnsSystemdResolved()
				return
			}
			await this.clearDnsResolvConf()
		} catch (error) {
			this.resetBackend()
			const next = await this.getBackend()
			if (next === backend) throw error

			if (next === 'networkmanager') {
				await this.clearDnsNetworkManager()
			} else if (next === 'systemd-resolved') {
				await this.clearDnsSystemdResolved()
			} else {
				await this.clearDnsResolvConf()
			}
		}
	}

	async getActiveDns(): Promise<Array<string>> {
		const backend = await this.getBackend()

		if (backend === 'networkmanager') {
			const fromNm = await this.getActiveDnsNetworkManager()
			if (fromNm.length) return fromNm
		}

		if (backend === 'systemd-resolved' || backend === 'networkmanager') {
			const fromResolved = await this.getActiveDnsSystemdResolved()
			if (fromResolved.length) return fromResolved
		}

		return this.getActiveDnsResolvConf()
	}

	async getInterfacesList(): Promise<Interface[]> {
		try {
			const nmDevices = await listNmDevices()
			const connected = nmDevices.filter((d) =>
				d.state.toLowerCase().includes('connected')
			)

			if (connected.length) {
				return connected.map((d) => this.toInterface(d.device, d.type))
			}
		} catch {
			// fall through to node/os + ip
		}

		const osIfaces = os.networkInterfaces()
		const list: Interface[] = []

		for (const [name, addrs] of Object.entries(osIfaces)) {
			if (!addrs || name === 'lo') continue
			const ipv4 = addrs.find((a) => a.family === 'IPv4' && !a.internal)
			if (!ipv4) continue
			list.push({
				name,
				mac_address: ipv4.mac,
				ip_address: ipv4.address,
				netmask: ipv4.netmask,
				type: /wl|wlan|wifi/i.test(name) ? 'Wireless' : 'Wired',
				vendor: 'Unknown',
				model: 'Unknown',
				gateway_ip: null,
			})
		}

		if (list.length) {
			const defaultIface = await getDefaultRouteInterface()
			if (defaultIface) {
				for (const item of list) {
					if (item.name === defaultIface) {
						item.gateway_ip = 'default'
					}
				}
			}
			return list
		}

		const devices = await listIpDevices()
		return devices.map((d) => this.toInterface(d.device, d.type))
	}

	public async flushDns(): Promise<void> {
		const attempts = [
			'resolvectl flush-caches',
			'systemd-resolve --flush-caches',
			'nscd -i hosts',
		]

		let flushed = false
		for (const cmd of attempts) {
			const bin = cmd.split(' ')[0]
			if (!(await commandExists(bin))) continue
			try {
				await this.execCmd(cmd)
				flushed = true
				break
			} catch {
				try {
					await runUserCmd(`${cmd} 2>/dev/null || true`)
					flushed = true
					break
				} catch {
					// try next
				}
			}
		}

		if (!flushed) {
			// Best-effort no-op: some distros have no local DNS cache daemon
			return
		}
	}

	// ─── NetworkManager ───────────────────────────────────────────────

	private async setDnsNetworkManager(nameServers: string[]): Promise<void> {
		const conn = await this.resolveNmConnection()
		const dns = nameServers.join(' ')
		const name = shellQuote(conn.name)

		await this.execCmd(
			`nmcli con mod ${name} ipv4.dns ${shellQuote(dns)} ipv4.ignore-auto-dns yes && nmcli con up ${name}`
		)
	}

	private async clearDnsNetworkManager(): Promise<void> {
		const conn = await this.resolveNmConnection()
		const name = shellQuote(conn.name)

		await this.execCmd(
			`nmcli con mod ${name} ipv4.dns "" ipv4.ignore-auto-dns no && nmcli con up ${name}`
		)
	}

	private async getActiveDnsNetworkManager(): Promise<string[]> {
		try {
			const conn = await this.resolveNmConnection()
			const stdout = await runUserCmd(
				`nmcli -t -f IP4.DNS con show ${shellQuote(conn.name)} 2>/dev/null || true`
			)

			const fromIp4 = stdout
				.trim()
				.split('\n')
				.map((line) => line.split(':').slice(1).join(':').trim())
				.filter(Boolean)

			if (fromIp4.length) return parseIpv4DnsList(fromIp4.join('\n'))

			// Fallback: configured ipv4.dns (may differ from applied)
			const configured = await runUserCmd(
				`nmcli -g ipv4.dns con show ${shellQuote(conn.name)} 2>/dev/null || true`
			)
			return parseIpv4DnsList(configured.replace(/\|/g, ' '))
		} catch {
			return []
		}
	}

	// ─── systemd-resolved ─────────────────────────────────────────────

	private async setDnsSystemdResolved(nameServers: string[]): Promise<void> {
		const device = await this.resolveDeviceName()
		const dns = nameServers.map(shellQuote).join(' ')
		const iface = shellQuote(device)

		await this.execCmd(
			`resolvectl dns ${iface} ${dns} && resolvectl domain ${iface} '~.'`
		)
	}

	private async clearDnsSystemdResolved(): Promise<void> {
		const device = await this.resolveDeviceName()
		await this.execCmd(`resolvectl revert ${shellQuote(device)}`)
	}

	private async getActiveDnsSystemdResolved(): Promise<string[]> {
		try {
			const device = await this.resolveDeviceName()
			const stdout = await runUserCmd(
				`resolvectl dns ${shellQuote(device)} 2>/dev/null || true`
			)
			const parsed = parseIpv4DnsList(stdout)
			if (parsed.length) return parsed

			const status = await runUserCmd('resolvectl status 2>/dev/null || true')
			return parseIpv4DnsList(status)
		} catch {
			return []
		}
	}

	// ─── /etc/resolv.conf fallback ────────────────────────────────────

	private async setDnsResolvConf(nameServers: string[]): Promise<void> {
		const content = `${nameServers.map((ip) => `nameserver ${ip}`).join('\n')}\n`
		const payload = Buffer.from(content, 'utf8').toString('base64')

		// Backup once so clearDns can restore DHCP/original resolvers
		const script = [
			`if [ ! -f ${shellQuote(RESOLV_BACKUP_PATH)} ]; then`,
			`  cp -a /etc/resolv.conf ${shellQuote(RESOLV_BACKUP_PATH)} 2>/dev/null || true`,
			'fi',
			// If resolv.conf is a symlink, replace with a real file we control
			'if [ -L /etc/resolv.conf ]; then',
			'  rm -f /etc/resolv.conf',
			'fi',
			`echo ${shellQuote(payload)} | base64 -d > /etc/resolv.conf`,
		].join('\n')

		await this.execCmd(`bash -c ${shellQuote(script)}`)
	}

	private async clearDnsResolvConf(): Promise<void> {
		const script = [
			`if [ -f ${shellQuote(RESOLV_BACKUP_PATH)} ]; then`,
			`  cp -a ${shellQuote(RESOLV_BACKUP_PATH)} /etc/resolv.conf`,
			`  rm -f ${shellQuote(RESOLV_BACKUP_PATH)}`,
			'elif command -v resolvectl >/dev/null 2>&1; then',
			"  DEFAULT_IFACE=$(ip -4 route show default 2>/dev/null | awk '{print $5}' | head -n1)",
			'  if [ -n "$DEFAULT_IFACE" ]; then resolvectl revert "$DEFAULT_IFACE" || true; fi',
			'else',
			// Avoid injecting public DNS — let DHCP/network manager recreate config.
			'  : > /etc/resolv.conf',
			'fi',
		].join('\n')

		await this.execCmd(`bash -c ${shellQuote(script)}`)
	}

	private async getActiveDnsResolvConf(): Promise<string[]> {
		try {
			const stdout = await runUserCmd(
				"grep -E '^nameserver' /etc/resolv.conf 2>/dev/null | awk '{print $2}' || true"
			)
			return parseIpv4DnsList(stdout)
		} catch {
			return []
		}
	}

	private toInterface(device: string, type: string): Interface {
		const osIfaces = os.networkInterfaces()[device]
		const ipv4 = osIfaces?.find((a) => a.family === 'IPv4' && !a.internal)

		return {
			name: device,
			mac_address: ipv4?.mac,
			ip_address: ipv4?.address,
			netmask: ipv4?.netmask ?? null,
			type: /wifi|wireless|wlan/i.test(type) ? 'Wireless' : 'Wired',
			vendor: 'Unknown',
			model: 'Unknown',
			gateway_ip: null,
		}
	}
}
