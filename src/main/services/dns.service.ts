import {Platform} from "../interfaces/platform.interface";


export class DnsService {
    constructor(private platform: Platform) {
    }

    async setDns(nameServers: Array<string>, interfaceName: string) {
        return this.platform.setDns(nameServers, interfaceName)
    }

    async getActiveDns(interfaceName: string) {
        return this.platform.getActiveDns(interfaceName)
    }

    async clearDns(interfaceName: string) {
        return this.platform.clearDns(interfaceName)
    }

    async getInterfacesList() {
        return this.platform.getInterfacesList()
    }


}
