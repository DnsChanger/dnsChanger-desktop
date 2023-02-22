// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron"
import { Server } from "./constants/servers.cosntant";

contextBridge.exposeInMainWorld('ipc', {
    setDns: (server: Server) => ipcRenderer.invoke('dialogs:set-dns', server),
    clearDns: () => ipcRenderer.invoke('dialogs:clear-dns')
})
