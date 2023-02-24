import {ipcMain, shell} from "electron";
import {dnsService} from "../config";
import {Server} from "../../shared/interfaces/server.interface";
import {EventsKeys} from "../../shared/constants/eventsKeys.constant";

ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
    try {
        const interfaces = await dnsService.getInterfacesList()
        const activeInterface = interfaces.find((inter: any) => inter.gateway_ip != null)
        if (!activeInterface) {
            return {server, success: false, message: "اتصال خود به اینترنت را بررسی کنید."}
        }
        await dnsService.setDns(server.servers, activeInterface.name)
        return {server, success: true, message: "موفقیت آمیز"}
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


ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
    shell.openExternal(url)
})
