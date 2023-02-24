import {ipcMain, shell} from "electron";
import {dnsService} from "../config";
import {Server} from "../../shared/interfaces/server.interface";
import {EventsKeys} from "../../shared/constants/eventsKeys.constant";

import {v4 as uuid} from "uuid"
import {isValidDnsAddress} from "../../shared/validators/dns.validator";
import {dnsListStore} from "../store/servers.store";


ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
    try {
        const interfaces = await dnsService.getInterfacesList()
        const activeInterface = interfaces.find((inter: any) => inter.gateway_ip != null)
        if (!activeInterface) {
            return {server, success: false, message: "اتصال خود به اینترنت را بررسی کنید."}
        }
        await dnsService.setDns(server.servers, activeInterface.name)
        return {server, success: true, message: `با موفقیت به ${server.names.fa} متصل شدید.`}
    } catch (e) {
        return {server, success: false, message: "خطا ناشناخته"}
    }
})

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
    try {
        const interfaces = await dnsService.getInterfacesList()
        const activeInterface = interfaces.find((inter: any) => inter.gateway_ip != null)
        if (!activeInterface) {
            return {server, success: false, message: "اتصال خود به اینترنت را بررسی کنید."}
        }
        await dnsService.clearDns(activeInterface.name)
        return {server, success: true, message: "موفقیت آمیز"}
    } catch (e) {
        return {server, success: false, message: "خطا ناشناخته"}
    }
})

ipcMain.handle(EventsKeys.ADD_DNS, async (event, data) => {
    // validators ..
    const nameServer1 = data.nameServers[0];
    const nameServer2 = data.nameServers[1];

    if (!isValidDnsAddress(nameServer1))
        return {success: false, message: "مقدار DNS 1 معتبر نیست."}


    if (nameServer2 && !isValidDnsAddress(nameServer2))
        return {success: false, message: "مقدار DNS 2 معتبر نیست."}

    if (nameServer1.toString() == nameServer2.toString())
        return {success: false, message: "مقدار DNS 1 و DNS 2 نباید تکراری باشند."}

    const newServer: Server = {
        key: uuid(),
        names: {
            eng: data.name,
            fa: data.name
        },
        avatar: "",
        servers: data.nameServers
    }

    const list: Server[] = dnsListStore.get("dnsList") || []
    list.push(newServer)
    dnsListStore.set("dnsList", list)
    return {success: true, server: newServer}
})

ipcMain.handle(EventsKeys.FETCH_DNS_LIST, (event) => {
    const list: Server[] = [] //servers;
    const store = dnsListStore.get("dnsList") || []
    // list.concat(store);
    return {success: true, servers: store}
})

ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
    shell.openExternal(url)
})
