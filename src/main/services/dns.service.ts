import type { Server } from '../../shared/interfaces/server.interface'
import {
	getServerProtocol,
	isEncryptedDns,
} from '../../shared/interfaces/server.interface'
import type { Platform } from '../platforms/platform'
import { EncryptedDnsService } from './encrypted-dns/encrypted-dns.service'

export class DnsService {
	private encryptedDns: EncryptedDnsService

	constructor(private platform: Platform) {
		this.encryptedDns = new EncryptedDnsService(platform)
	}

	async setDns(server: Server | string[]) {
		// Backward-compatible: string[] = plaintext nameservers
		if (Array.isArray(server)) {
			await this.encryptedDns.disconnect({ restoreSystemDns: false })
			return this.platform.setDns(server)
		}

		if (isEncryptedDns(server)) {
			return this.encryptedDns.connect(server)
		}

		await this.encryptedDns.disconnect({ restoreSystemDns: false })
		return this.platform.setDns(server.servers)
	}

	async getActiveDns() {
		return this.platform.getActiveDns()
	}

	async clearDns() {
		const active = this.encryptedDns.getActiveConnection()
		if (active) {
			await this.encryptedDns.disconnect({ restoreSystemDns: true })
			return
		}
		return this.platform.clearDns()
	}

	getActiveEncryptedConnection() {
		return this.encryptedDns.getActiveConnection()
	}

	async getInterfacesList() {
		return this.platform.getInterfacesList()
	}

	async flushDns() {
		return this.platform.flushDns()
	}

	isEncrypted(server: Server) {
		return isEncryptedDns(server)
	}

	getProtocol(server: Server) {
		return getServerProtocol(server)
	}
}
