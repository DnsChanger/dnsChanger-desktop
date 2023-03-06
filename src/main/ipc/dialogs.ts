import {ipcMain, shell, dialog} from 'electron';
import {dnsService} from "../config";
import {Server} from "../../shared/interfaces/server.interface";
import {EventsKeys} from "../../shared/constants/eventsKeys.constant";

import {v4 as uuid} from "uuid"
import {isValidDnsAddress} from "../../shared/validators/dns.validator";
import {dnsListStore} from "../store/servers.store";
import {ResponseMessage} from "../constant/messages.constant";
import _ from "lodash";


ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
    try {
        await dnsService.setDns(server.servers)
        return {server, success: true, message: `با موفقیت به ${server.names.fa} متصل شدید.`}
    } catch (e: any) {
        return {server, ...errorHandling(e)}
    }
})

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
    try {
        await dnsService.clearDns()
        return {server, success: true, message: "موفقیت آمیز"}
    } catch (e) {
        return {server, ...errorHandling(e)}
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

ipcMain.handle(EventsKeys.RELOAD_SERVER_LIST, async (event, servers: Server[]) => {
    dnsListStore.set("dnsList", servers)
    return {success: true}
})

ipcMain.handle(EventsKeys.FETCH_DNS_LIST, (event) => {
    const store = dnsListStore.get("dnsList") || []
    return {success: true, servers: store}
})

ipcMain.handle(EventsKeys.GET_CUREENT_ACTIVE, async (): Promise<any> => {
    try {
        const dns: string[] = await dnsService.getActiveDns()
        if (!dns.length)
            return {success: false, server: null}
        const store = dnsListStore.get("dnsList") || []
        const server: Server | null = store.find((server) => server.servers.toString() == dns.toString())
        if (!server)
            return {
                success: true, server: {
                    key: "unknown",
                    servers: dns,
                    names: {
                        eng: "unknown",
                        fa: "unknown"
                    },
                    avatar: ""
                }
            }
        else {
            return {success: true, server}
        }
    } catch (error) {
        return errorHandling(error)
    }
})

ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
    shell.openExternal(url)
})


ipcMain.on(EventsKeys.DIALOG_ERROR, (ev: any, title: string, message: string) => {
    dialog.showErrorBox(title, message)
})
ipcMain.handle(EventsKeys.DELETE_DNS, (ev: any, server: Server) => {
    const dnsList = dnsListStore.get("dnsList")

    _.remove(dnsList, dns => dns.key === server.key)

    dnsListStore.set("dnsList", dnsList)

    return {
        success: true,
        servers: dnsList
    }
})

function errorHandling(e: any) {
    // @ts-ignore
    const msg = ResponseMessage[e.message]

    return {success: false, message: msg || "خطا ناشناخته"}
}
