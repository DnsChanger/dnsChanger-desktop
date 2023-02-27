// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { Server } from "./shared/interfaces/server.interface";
import { EventsKeys } from "./shared/constants/eventsKeys.constant";

contextBridge.exposeInMainWorld('ipc', {
    setDns: (server: Server) => ipcRenderer.invoke(EventsKeys.SET_DNS, server),
    clearDns: () => ipcRenderer.invoke(EventsKeys.CLEAR_DNS),
    notif: (message: string) => ipcRenderer.send(EventsKeys.NOTIFICATION, message),
    dialogError: (title: string, message: string) => ipcRenderer.send(EventsKeys.DIALOG_ERROR, title, message),
    openBrowser: (url: string) => ipcRenderer.send(EventsKeys.OPEN_BROWSER, url),
    addDns: (data: unknown) => ipcRenderer.invoke(EventsKeys.ADD_DNS, data),
    fetchCustomServers: () => ipcRenderer.invoke(EventsKeys.FETCH_DNS_LIST),
    getCurrentActive: () => ipcRenderer.invoke(EventsKeys.GET_CUREENT_ACTIVE)
})
