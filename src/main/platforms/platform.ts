import sudo  from '@vscode/sudo-prompt'

export abstract class Platform {
	public abstract setDns(nameServers: string[]): Promise<void>

	public abstract getActiveDns(): Promise<string[]>

	public abstract clearDns(): Promise<void>

	public abstract getInterfacesList(): Promise<any>

	public abstract flushDns(): Promise<void>

	public async setInterfaceStatus(name: string, enable: boolean): Promise<boolean> {
		return true
	}

	public async switchNetworkType(targetType: 'lan' | 'wifi' | 'both'): Promise<boolean> {
		return true
	}

	protected execCmd(cmd: string): Promise<string | Buffer> {
		return new Promise((resolve, reject) => {
			sudo.exec(cmd, { name: 'dnsChanger' }, (error, stdout) => {
				if (error) {
					reject(error)
					return
				}
				resolve(stdout as any)
			})
		})
	}
}
