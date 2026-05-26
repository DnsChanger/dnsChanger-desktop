import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { Platform } from '../platform'

const execAsync = promisify(exec)

export class LinuxPlatform extends Platform {
	private async getActiveConnectionName(): Promise<string> {
		const { stdout } = await execAsync('nmcli -t -f NAME con show --active')
		const conn = stdout.trim().split('\n')[0]
		if (!conn) throw new Error('No active network connection found')
		return conn
	}

	async setDns(nameServers: Array<string>): Promise<void> {
		const conn = await this.getActiveConnectionName()
		const dns = nameServers.join(' ')
		await this.execCmd(
			`nmcli con mod "${conn}" ipv4.dns "${dns}" ipv4.ignore-auto-dns yes && nmcli con up "${conn}"`,
		)
	}

	async clearDns(): Promise<void> {
		const conn = await this.getActiveConnectionName()
		await this.execCmd(
			`nmcli con mod "${conn}" ipv4.dns "" ipv4.ignore-auto-dns no && nmcli con up "${conn}"`,
		)
	}

	async getActiveDns(): Promise<Array<string>> {
		try {
			const { stdout } = await execAsync(
				"nmcli -t -f IP4.DNS con show --active 2>/dev/null | cut -d: -f2",
			)
			const results = stdout.trim().split('\n').filter(Boolean)
			if (results.length) return results
		} catch {}

		// fallback to resolv.conf
		const { stdout } = await execAsync(
			"grep '^nameserver' /etc/resolv.conf | awk '{print $2}'",
		)
		return stdout.trim().split('\n').filter(Boolean)
	}

	async getInterfacesList(): Promise<Array<{ name: string; value: string }>> {
		try {
			const { stdout } = await execAsync(
				"nmcli -t -f DEVICE,TYPE,STATE device status | grep ':connected'",
			)
			return stdout
				.trim()
				.split('\n')
				.filter(Boolean)
				.map((line) => {
					const [device] = line.split(':')
					return { name: device, value: device }
				})
		} catch {
			return []
		}
	}

	public async flushDns(): Promise<void> {
		try {
			await this.execCmd(
				'resolvectl flush-caches 2>/dev/null || systemd-resolve --flush-caches',
			)
		} catch {}
	}
}
