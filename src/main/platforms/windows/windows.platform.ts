import network from 'network'
import sudo from 'sudo-prompt'

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

	getInterfacesList(): Promise<Interface[]> {
		return new Promise((resolve, reject) => {
			network.get_interfaces_list((err: unknown, obj: unknown) => {
				if (err) reject(err)
				else resolve(obj as Interface[])
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

	async isWmicAvailable(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			sudo.exec(
				'wmic',
				{
					name: 'DnsChanger',
				},
				(error) => {
					if (error) {
						resolve(false)
						return
					}
					resolve(true)
				},
			)
		})
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
}
