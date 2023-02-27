import { Platform } from "../../interfaces/platform.interface";
import sudo from "sudo-prompt";

export class LinuxPlatform implements Platform {
    constructor() { }

    async clearDns(interfaceName: string): Promise<void> {
        try {
            await this.setDns(["192.168.1.1", "127.0.0.1"], "")
        } catch (e) {
            throw e;
        }
    }

    async getActiveDns(interfaceName: string): Promise<Array<string>> {
        try {
            const cmd = "grep nameserver /etc/resolv.conf | awk '{print $2}'";
            const text = await this.execCmd(cmd) as string;
            return text.trim().split("\n");
        } catch (e) {
            throw e;
        }
    }

    async getInterfacesList(): Promise<any> {
        return [];
    }

    async setDns(nameServers: Array<string>, interfaceName: string): Promise<void> {
        try {
            let lines = "";
            for (let i = 0; i < nameServers.length; i++) {
                lines += `nameserver ${nameServers[i]}\n`;
            }
            const cmd = `echo "${lines.trim()}" > /etc/resolv.conf`;
            await this.execCmd(cmd);
            const cmdRestart = 'systemctl restart systemd-networkd';
            await this.execCmd(cmdRestart);
        } catch (e) {
            throw e;
        }
    }

    private execCmd(cmd: string): Promise<string | Buffer> {
        return new Promise((resolve, reject) => {
            sudo.exec(cmd, { name: "dnsChanger" }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });

        });
    }
}
// Powered by ChatGpt 