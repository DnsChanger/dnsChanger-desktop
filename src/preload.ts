// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from "electron"
import {Server} from "./shared/interfaces/server.interface";
import {EventsKeys} from "./shared/constants/eventsKeys.constant";

contextBridge.exposeInMainWorld('ipc', {
    setDns: (server: Server) => ipcRenderer.invoke(EventsKeys.SET_DNS, server),
    clearDns: () => ipcRenderer.invoke(EventsKeys.CLEAR_DNS),
    notif: (message: string) => ipcRenderer.send(EventsKeys.NOTIFICATION, message),
    openBrowser: (url: string) => ipcRenderer.send(EventsKeys.OPEN_BROWSER, url)
})
