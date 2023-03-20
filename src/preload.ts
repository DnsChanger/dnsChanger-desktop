// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from "electron"
import {Server} from "./shared/interfaces/server.interface";
import {EventsKeys} from "./shared/constants/eventsKeys.constant";

const ipc = {
    setDns: (server: Server) => ipcRenderer.invoke(EventsKeys.SET_DNS, server),
    clearDns: () => ipcRenderer.invoke(EventsKeys.CLEAR_DNS),
    notif: (message: string) => ipcRenderer.send(EventsKeys.NOTIFICATION, message),
    dialogError: (title: string, message: string) => ipcRenderer.send(EventsKeys.DIALOG_ERROR, title, message),
    openBrowser: (url: string) => ipcRenderer.send(EventsKeys.OPEN_BROWSER, url),
    addDns: (data: unknown) => ipcRenderer.invoke(EventsKeys.ADD_DNS, data),
    deleteDns: (server: Server) => ipcRenderer.invoke(EventsKeys.DELETE_DNS, server),
    reloadServerList: (servers: Array<Server>) => ipcRenderer.invoke(EventsKeys.RELOAD_SERVER_LIST, servers),
    fetchDnsList: () => ipcRenderer.invoke(EventsKeys.FETCH_DNS_LIST),
    getCurrentActive: () => ipcRenderer.invoke(EventsKeys.GET_CUREENT_ACTIVE),
    getSettings: () => ipcRenderer.invoke(EventsKeys.GET_SETTINGS),
    toggleStartUP: () => ipcRenderer.invoke(EventsKeys.TOGGLE_START_UP)
}
contextBridge.exposeInMainWorld('ipc', ipc)


const ui = {
    toggleTheme: (newTheme: string) => ipcRenderer.send(EventsKeys.TOGGLE_THEME, newTheme)
}
contextBridge.exposeInMainWorld('ui', ui)

declare global {
    interface Window {
        ipc: typeof ipc
        ui: typeof ui
    }
}

