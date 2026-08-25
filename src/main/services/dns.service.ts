import { Platform } from '../platforms/platform'

export class DnsService {
	constructor(private platform: Platform) {}

	async setDns(nameServers: Array<string>) {
		return this.platform.setDns(nameServers)
	}

	async getActiveDns() {
		return this.platform.getActiveDns()
	}

	async clearDns() {
		return this.platform.clearDns()
	}

	async getInterfacesList() {
		return this.platform.getInterfacesList()
	}

	async flushDns() {
		return this.platform.flushDns()
	}

	async setInterfaceStatus(name: string, enable: boolean) {
		return this.platform.setInterfaceStatus(name, enable)
	}

	async switchNetworkType(targetType: 'lan' | 'wifi' | 'both') {
		return this.platform.switchNetworkType(targetType)
	}
}
