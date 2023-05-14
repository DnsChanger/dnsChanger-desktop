import { Platform } from "../platform";

export class LinuxPlatform extends Platform {
  async clearDns(): Promise<void> {
    try {
      await this.setDns(["1.1.1.1", "8.8.8.8", "192.168.1.1", "127.0.0.1"]);
    } catch (e) {
      throw e;
    }
  }

  async getActiveDns(): Promise<Array<string>> {
    try {
      const cmd = "grep nameserver /etc/resolv.conf | awk '{print $2}'";
      const text = (await this.execCmd(cmd)) as string;

      const regex = /(?<=nameserver\s)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
      return text.trim().match(regex);
    } catch (e) {
      throw e;
    }
  }

  async getInterfacesList(): Promise<any> {
    return [];
  }

  async setDns(nameServers: Array<string>): Promise<void> {
    try {
      let lines = "";

      for (let i = 0; i < nameServers.length; i++) {
        lines += `nameserver ${nameServers[i]}\n`;
      }

      const cmd = `echo '${lines.trim()}' > /etc/resolv.conf`;
      await this.execCmd(cmd);

      const cmdRestart = "systemctl restart systemd-networkd";
      await this.execCmd(cmdRestart);
    } catch (e) {
      throw e;
    }
  }

  public async flushDns(): Promise<void> {
    try {
      await this.execCmd("systemd-resolve --flush-caches");
    } catch (e) {
      throw e;
    }
  }
}
// Powered by ChatGpt
