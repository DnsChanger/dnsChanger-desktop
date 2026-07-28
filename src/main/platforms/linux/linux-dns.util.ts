import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export type LinuxDnsBackend = 'networkmanager' | 'systemd-resolved' | 'resolvconf'

export const RESOLV_BACKUP_PATH = '/etc/resolv.conf.dnschanger.bak'

/** POSIX-safe single-quote for shell arguments. */
export function shellQuote(value: string): string {
	return `'${value.replace(/'/g, `'\\''`)}'`
}

export async function runUserCmd(cmd: string): Promise<string> {
	const { stdout } = await execAsync(cmd, { timeout: 15_000 })
	return (stdout ?? '').toString()
}

export async function commandExists(bin: string): Promise<boolean> {
	try {
		await runUserCmd(`command -v ${shellQuote(bin)}`)
		return true
	} catch {
		return false
	}
}

export async function isServiceActive(service: string): Promise<boolean> {
	try {
		const out = await runUserCmd(
			`systemctl is-active ${shellQuote(service)} 2>/dev/null || true`
		)
		return out.trim() === 'active'
	} catch {
		return false
	}
}

export async function isResolvConfManagedByResolved(): Promise<boolean> {
	try {
		const target = (
			await runUserCmd('readlink -f /etc/resolv.conf 2>/dev/null || true')
		).trim()
		if (!target) return false
		return (
			target.includes('systemd') ||
			target.includes('stub-resolv.conf') ||
			target.includes('resolv.conf.d')
		)
	} catch {
		return false
	}
}

export function parseIpv4DnsList(text: string): string[] {
	const matches = text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []
	return [...new Set(matches)].filter((ip) => {
		const parts = ip.split('.').map(Number)
		return parts.length === 4 && parts.every((p) => p >= 0 && p <= 255)
	})
}

export interface LinuxConnection {
	name: string
	device: string
	type: string
}

/**
 * Prefer ethernet/wifi connections; skip loopback and typically ignore pure VPN
 * unless nothing else is connected.
 */
export function pickPreferredConnection(
	connections: LinuxConnection[]
): LinuxConnection | null {
	if (!connections.length) return null

	const isPrimary = (c: LinuxConnection) =>
		/ethernet|wifi|wireless|802-11|802-3/i.test(c.type) ||
		(!/vpn|bridge|tun|tap|loopback|docker|veth/i.test(c.type) &&
			!/^(lo|docker|veth|br-)/i.test(c.device))

	return connections.find(isPrimary) || connections[0]
}

export async function listNmConnections(): Promise<LinuxConnection[]> {
	const stdout = await runUserCmd(
		'nmcli -t -f NAME,DEVICE,TYPE con show --active 2>/dev/null || true'
	)

	return stdout
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const [name, device, type] = line.split(':')
			return {
				name: name || '',
				device: device || '',
				type: type || '',
			}
		})
		.filter((c) => c.name && c.device && c.device !== 'lo')
}

export async function listNmDevices(): Promise<
	Array<{ device: string; type: string; state: string; connection: string }>
> {
	const stdout = await runUserCmd(
		'nmcli -t -f DEVICE,TYPE,STATE,CONNECTION device status 2>/dev/null || true'
	)

	return stdout
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const [device, type, state, connection] = line.split(':')
			return {
				device: device || '',
				type: type || '',
				state: state || '',
				connection: connection && connection !== '--' ? connection : '',
			}
		})
		.filter((d) => d.device && d.device !== 'lo')
}

export async function detectLinuxDnsBackend(): Promise<LinuxDnsBackend> {
	const hasNmcli = await commandExists('nmcli')
	if (hasNmcli && (await isServiceActive('NetworkManager'))) {
		try {
			const connections = await listNmConnections()
			if (connections.length > 0) return 'networkmanager'
		} catch {
			// fall through
		}
	}

	const hasResolvectl = await commandExists('resolvectl')
	if (
		hasResolvectl &&
		((await isServiceActive('systemd-resolved')) ||
			(await isResolvConfManagedByResolved()))
	) {
		return 'systemd-resolved'
	}

	if (await isResolvConfManagedByResolved()) {
		if (hasResolvectl) return 'systemd-resolved'
	}

	return 'resolvconf'
}

export async function listIpDevices(): Promise<Array<{ device: string; type: string }>> {
	try {
		const stdout = await runUserCmd("ls /sys/class/net 2>/dev/null | tr ' ' '\\n'")
		return stdout
			.trim()
			.split('\n')
			.filter((d) => d && d !== 'lo')
			.map((device) => ({
				device,
				type: /wl|wlan|wifi/i.test(device) ? 'wifi' : 'ethernet',
			}))
	} catch {
		return []
	}
}

export async function getDefaultRouteInterface(): Promise<string | null> {
	try {
		const stdout = await runUserCmd(
			"ip -4 route show default 2>/dev/null | awk '{print $5}' | head -n1"
		)
		const iface = stdout.trim()
		return iface || null
	} catch {
		return null
	}
}
