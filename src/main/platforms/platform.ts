import sudo from 'sudo-prompt';

export abstract class Platform {
    public abstract setDns(nameServers: string[]): Promise<void>

    public abstract getActiveDns(): Promise<string[]>

    public abstract clearDns(): Promise<void>

    public abstract getInterfacesList(): Promise<any>

    protected execCmd(cmd: string): Promise<string | Buffer> {
        return new Promise((resolve, reject) => {
            sudo.exec(cmd, {name: 'dnsChanger'}, (error, stdout) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        })
    }

}
