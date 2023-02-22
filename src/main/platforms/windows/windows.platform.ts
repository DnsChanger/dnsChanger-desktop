import { Platform } from "../../interfaces/platform.interface";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import network from "network"
import sudo from "sudo-prompt";

export class WindowsPlatform implements Platform {
    constructor() {
    }

    clearDns(interfaceName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            sudo.exec(`netsh interface ip set dns "${interfaceName}" dhcp`, {
                name: "test"
            }, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return;
                }
                resolve()
            });
        })
    }

    async getActiveDns(interfaceName: string): Promise<Array<string>> {
        try {
            const cmd = `netsh interface ip show dns "${interfaceName}"`;
            const text = await this.execCmd(cmd) as string
            return this.extractDns(text)
        } catch (e) {
            throw e
        }
    }

    getInterfacesList(): Promise<any> {
        return new Promise((resolve, reject) => {
            network.get_interfaces_list((err: any, obj: any) => {
                if (err) reject(err)
                else resolve(obj)
            })
        })
    }

    async setDns(nameServers: Array<string>, interfaceName: string): Promise<void> {
        try {
            const cmdServer1 = `netsh interface ip set dns "${interfaceName}" static ${nameServers[0]}`;
            await this.execCmd(cmdServer1);
            if (nameServers[1]) {
                const cmdServer2 = `netsh interface ip add dns "${interfaceName}" ${nameServers[1]} index=2`;
                await this.execCmd(cmdServer2)
            }
        } catch (e) {
            throw e
        }
    }

    private execCmd(cmd: string): Promise<string | Buffer> {
        return new Promise((resolve, reject) => {
            sudo.exec(cmd, { name: "dnsChanger" }, (error, stdout, stderr) => {
                if (error) {
                    reject(error)
                    return;
                }
                resolve(stdout)
            });
        })
    }

    private extractDns(input: string): Array<string> {
        const regex = /Statically Configured DNS Servers:\s+([\d.]+)\s+([\d.]+)/gm;
        const matches = regex.exec(input);
        const dnsServers = [matches[1].trim(), matches[2].trim()];
        return dnsServers
        //ChatGpt
    }


}
