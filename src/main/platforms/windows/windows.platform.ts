import * as os from 'node:os'
import { exec } from 'node:child_process'
import sudo from '@vscode/sudo-prompt'


import { store } from '../../store/store'
import { Platform } from '../platform'
import { Interface } from './interfaces/interface'

export class WindowsPlatform extends Platform {
	async clearDns(): Promise<void> {
		try {
			let networkInterface = store.get('settings').network_interface
			if (networkInterface === 'Auto')
				networkInterface = (await this.getValidateInterface()).name

			return new Promise((resolve, reject) => {
				sudo.exec(
					`netsh interface ip set dns "${networkInterface}" dhcp`,
					{
						name: 'DnsChanger',
					},
					(error) => {
						if (error) {
							reject(error)
							return
						}
						resolve()
					},
				)
			})
		} catch (e) {
			throw e
		}
	}

	async getActiveDns(): Promise<Array<string>> {
		try {
			let networkInterface = store.get('settings').network_interface
			if (networkInterface === 'Auto')
				networkInterface = (await this.getValidateInterface()).name

			const cmd = `netsh interface ip show dns "${networkInterface}"`
			const text = (await this.execCmd(cmd)) as string

			return this.extractDns(text)
		} catch (e) {
			throw e
		}
	}

	async getInterfacesList(): Promise<Interface[]> {
		const osInterfaces = os.networkInterfaces()
		const list: Interface[] = []
		let gatewayInfo: Record<string, string> = {}

		try {
			gatewayInfo = await this.getGateways()
		} catch (e) {}

		try {
			const showInterfaceOutput = await this.getNetshInterfaces()
			if (showInterfaceOutput && showInterfaceOutput.length > 0) {
				for (const item of showInterfaceOutput) {
					const ipv4List = osInterfaces[item.name] || []
					const ipv4 = ipv4List.find((a) => a.family === 'IPv4' && !a.internal)

					list.push({
						name: item.name,
						mac_address: ipv4?.mac || undefined,
						ip_address: ipv4?.address || undefined,
						netmask: ipv4?.netmask || null,
						admin_state: item.admin_state,
						connection_state: item.connection_state,
						type:
							item.name.toLowerCase().includes('wi-fi') ||
							item.name.toLowerCase().includes('wifi') ||
							item.name.toLowerCase().includes('wireless') ||
							item.name.toLowerCase().includes('wlan')
								? 'Wireless'
								: 'Wired',
						vendor: 'Unknown',
						model: 'Unknown',
						gateway_ip: gatewayInfo[item.name] || null,
					})
				}
				return list
			}
		} catch (e) {}

		for (const [name, addrs] of Object.entries(osInterfaces)) {
			const ipv4 = addrs.find((a) => a.family === 'IPv4' && !a.internal)
			if (ipv4) {
				list.push({
					name: name,
					mac_address: ipv4.mac,
					ip_address: ipv4.address,
					netmask: ipv4.netmask,
					admin_state: 'Enabled',
					connection_state: gatewayInfo[name] ? 'Connected' : 'Disconnected',
					type:
						name.toLowerCase().includes('wi-fi') ||
						name.toLowerCase().includes('wifi') ||
						name.toLowerCase().includes('wireless') ||
						name.toLowerCase().includes('wlan')
							? 'Wireless'
							: 'Wired',
					vendor: 'Unknown',
					model: 'Unknown',
					gateway_ip: gatewayInfo[name] || null,
				})
			}
		}

		return list
	}

	private getNetshInterfaces(): Promise<
		Array<{
			name: string
			admin_state: 'Enabled' | 'Disabled'
			connection_state: 'Connected' | 'Disconnected'
		}>
	> {
		return new Promise((resolve) => {
			exec('netsh interface show interface', (error, stdout) => {
				if (error || !stdout) {
					resolve([])
					return
				}

				const result: Array<{
					name: string
					admin_state: 'Enabled' | 'Disabled'
					connection_state: 'Connected' | 'Disconnected'
				}> = []
				const lines = stdout.split(/\r?\n/)

				for (const line of lines) {
					const trimmed = line.trim()
					if (
						!trimmed ||
						trimmed.startsWith('Admin State') ||
						trimmed.startsWith('---')
					) {
						continue
					}

					const match = trimmed.match(
						/^(Enabled|Disabled)\s+(Connected|Disconnected|Connecting)\s+\S+\s+(.+)$/i,
					)
					if (match) {
						const adminState = (match[1].charAt(0).toUpperCase() +
							match[1].slice(1).toLowerCase()) as 'Enabled' | 'Disabled'
						const connectionState = (match[2].charAt(0).toUpperCase() +
							match[2].slice(1).toLowerCase()) as 'Connected' | 'Disconnected'
						const name = match[3].trim()
						result.push({
							name,
							admin_state: adminState,
							connection_state: connectionState,
						})
					}
				}
				resolve(result)
			})
		})
	}

	private getGateways(): Promise<Record<string, string>> {
		return new Promise((resolve) => {
			exec('netsh interface ip show config', (error, stdout) => {
				if (error) {
					resolve({})
					return
				}

				const gateways: Record<string, string> = {}
				const sections = stdout.split(/\r?\n\r?\n/)
				for (const section of sections) {
					const nameMatch = section.match(/Configuration for interface "(.+)"/)
					if (nameMatch) {
						const name = nameMatch[1]
						const gatewayMatch = section.match(/[Gg]ateway.*:\s+([\d.]+)/)
						if (gatewayMatch) {
							gateways[name] = gatewayMatch[1]
						}
					}
				}
				resolve(gateways)
			})
		})
	}

	async setDns(nameServers: Array<string>): Promise<void> {
		try {
			let networkInterface = store.get('settings').network_interface
			if (networkInterface === 'Auto')
				networkInterface = (await this.getValidateInterface()).name
			const cmdServer1 = `netsh interface ip set dns "${networkInterface}" static ${nameServers[0]}`

			await this.execCmd(cmdServer1)

			if (nameServers[1]) {
				const cmdServer2 = `netsh interface ip add dns "${networkInterface}" ${nameServers[1]} index=2`
				await this.execCmd(cmdServer2)
			}
		} catch (e) {
			throw e
		}
	}

	private async getValidateInterface() {
		try {
			const interfaces: Interface[] = await this.getInterfacesList()
			const activeInterface: Interface | null = interfaces.find(
				(inter: Interface) => inter.gateway_ip != null,
			)

			if (!activeInterface) throw new Error('CONNECTION_FAILED')
			return activeInterface
		} catch (error) {
			throw error
		}
	}

	private extractDns(input: string): Array<string> {
		const regex = /Statically Configured DNS Servers:\s+([\d.]+)\s+([\d.]+)/gm
		const matches = regex.exec(input) || []
		if (!matches.length) return []
		return [matches[1].trim(), matches[2].trim()]
	}

	public async flushDns(): Promise<void> {
		return new Promise((resolve, reject) => {
			sudo.exec(
				'ipconfig /flushdns',
				{
					name: 'DnsChanger',
				},
				(error) => {
					if (error) {
						reject(error)
						return
					}
					resolve()
				},
			)
		})
	}

	public async setInterfaceStatus(name: string, enable: boolean): Promise<boolean> {
		try {
			const action = enable ? 'ENABLED' : 'DISABLED'
			const cmd = `netsh interface set interface name="${name}" admin=${action}`
			await this.execCmd(cmd)
			return true
		} catch (e) {
			throw e
		}
	}

	public async switchNetworkType(targetType: 'lan' | 'wifi' | 'both'): Promise<boolean> {
		try {
			const interfaces = await this.getInterfacesList()
			const lanInterfaces = interfaces.filter((i) => i.type === 'Wired')
			const wifiInterfaces = interfaces.filter((i) => i.type === 'Wireless')

			if (targetType === 'lan') {
				for (const item of lanInterfaces) {
					await this.setInterfaceStatus(item.name, true).catch(() => {})
				}
				for (const item of wifiInterfaces) {
					await this.setInterfaceStatus(item.name, false).catch(() => {})
				}
			} else if (targetType === 'wifi') {
				for (const item of wifiInterfaces) {
					await this.setInterfaceStatus(item.name, true).catch(() => {})
				}
				for (const item of lanInterfaces) {
					await this.setInterfaceStatus(item.name, false).catch(() => {})
				}
			} else if (targetType === 'both') {
				for (const item of interfaces) {
					await this.setInterfaceStatus(item.name, true).catch(() => {})
				}
			}
			return true
		} catch (e) {
			throw e
		}
	}
}
