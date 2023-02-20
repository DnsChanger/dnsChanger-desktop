import {DnsService} from "./services/dns.service";
import {WindowsPlatform} from "./platforms/windows/windows.platform";

export const dnsService: DnsService = new DnsService(new WindowsPlatform())
