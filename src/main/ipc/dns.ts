import { ipcMain } from "electron";
import { Server } from "../../constants/servers.cosntant";
import { dnsService } from "../config";

ipcMain.handle("dialogs:set-dns", async (event, server: Server) => {
    try {
        const interfaces = await dnsService.getInterfacesList()
        const activeInterface = interfaces.find((inter: any) => inter.gateway_ip != null)
        if (!activeInterface) {
            return { server, success: false, message: "اتصال خود به اینترنت را بررسی کنید." }
        }
        await dnsService.setDns(server.servers, activeInterface.name)
        return { server, success: true, message: "موفقیت آمیز" }
    } catch (e) {
        return { server, success: false, message: "خطا ناشناخته" }
    }
})

ipcMain.handle("dialogs:clear-dns", async (event, server: Server) => {
    try {
        const interfaces = await dnsService.getInterfacesList()
        const activeInterface = interfaces.find((inter: any) => inter.gateway_ip != null)
        if (!activeInterface) {
            return { server, success: false, message: "اتصال خود به اینترنت را بررسی کنید." }
        }
        await dnsService.clearDns(activeInterface.name)
        return { server, success: true, message: "موفقیت آمیز" }
    } catch (e) {
        return { server, success: false, message: "خطا ناشناخته" }
    }
})

