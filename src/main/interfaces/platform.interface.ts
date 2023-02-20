export interface Platform {
    setDns(nameServers: Array<string>, interfaceName: string): Promise<void>

    getActiveDns(interfaceName: string): Promise<Array<string>>

    clearDns(interfaceName: string): Promise<void>


    getInterfacesList(): Promise<any>


}
