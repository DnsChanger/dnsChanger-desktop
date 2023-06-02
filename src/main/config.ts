import os from "os";
import { app } from "electron";
import AutoLaunch from "auto-launch";

import { Platform } from "./platforms/platform";
import { DnsService } from "./services/dns.service";
import { LinuxPlatform } from "./platforms/linux/linux.platform";
import { WindowsPlatform } from "./platforms/windows/windows.platform";
import { MacPlatform } from "./platforms/mac/mac.platform";

let platform: Platform;

switch (os.platform()) {
  case "win32":
    platform = new WindowsPlatform();
    break;
  case "linux":
    platform = new LinuxPlatform();
    break;
  case "darwin":
    platform = new MacPlatform();
    break;
  default:
    throw new Error("INVALID_PLATFORM");
}

export const dnsService: DnsService = new DnsService(platform);

export const autoLauncher = new AutoLaunch({
  name: app.getName(),
  isHidden: false, // show the app on startup
  mac: {
    useLaunchAgent: true, // use a launch agent instead of a launch daemon (macOS only)
  },
});
