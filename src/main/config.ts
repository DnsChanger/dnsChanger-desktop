import {DnsService} from "./services/dns.service";
import {WindowsPlatform} from "./platforms/windows/windows.platform";
import os from "os"
import {LinuxPlatform} from "./platforms/linux/linux.platform";
import {Platform} from './platforms/platform';
import AutoLaunch from 'auto-launch'
import {app} from "electron";

let platform: Platform;


switch (os.platform()) {
    case "win32":
        platform = new WindowsPlatform()
        break;
    case "linux":
        platform = new LinuxPlatform();
        break;
    default:
        throw new Error("INVALID_PLATFORM")
}

export const dnsService: DnsService = new DnsService(platform)
export const autoLauncher = new AutoLaunch({
    name: app.getName(),
    isHidden: false, // show the app on startup
    mac: {
        useLaunchAgent: true, // use a launch agent instead of a launch daemon (macOS only)
    },
});
