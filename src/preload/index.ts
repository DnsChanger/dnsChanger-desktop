// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

import { Server, ServerStore } from "../shared/interfaces/server.interface";
import { EventsKeys } from "../shared/constants/eventsKeys.constant";
import {
  SettingInStore,
  StoreKey,
} from "../shared/interfaces/settings.interface";
import os from "os";
import { store } from "../main/store/store";

export const ipcPreload = {
  setDns: (server: Server) => ipcRenderer.invoke(EventsKeys.SET_DNS, server),
  clearDns: () => ipcRenderer.invoke(EventsKeys.CLEAR_DNS),
  notif: (message: string) =>
    ipcRenderer.send(EventsKeys.NOTIFICATION, message),
  dialogError: (title: string, message: string) =>
    ipcRenderer.send(EventsKeys.DIALOG_ERROR, title, message),
  openBrowser: (url: string) => ipcRenderer.send(EventsKeys.OPEN_BROWSER, url),
  addDns: (data: Partial<Server>) =>
    ipcRenderer.invoke(EventsKeys.ADD_DNS, data),
  deleteDns: (server: Server) =>
    ipcRenderer.invoke(EventsKeys.DELETE_DNS, server),
  reloadServerList: (servers: Array<Server>) =>
    ipcRenderer.invoke(EventsKeys.RELOAD_SERVER_LIST, servers),
  fetchDnsList: () => ipcRenderer.invoke(EventsKeys.FETCH_DNS_LIST),
  getCurrentActive: () => ipcRenderer.invoke(EventsKeys.GET_CURRENT_ACTIVE),
  getSettings: () => ipcRenderer.invoke(EventsKeys.GET_SETTINGS),
  toggleStartUP: () => ipcRenderer.invoke(EventsKeys.TOGGLE_START_UP),
  flushDns: () => ipcRenderer.invoke(EventsKeys.FLUSHDNS),
  saveSettings: (settings: SettingInStore) =>
    ipcRenderer.invoke(EventsKeys.SAVE_SETTINGS, settings),
  ping: (server: Server) => ipcRenderer.invoke(EventsKeys.PING, server),
  checkUpdate: () => ipcRenderer.invoke(EventsKeys.CHECK_UPDATE),
  startUpdate: () => ipcRenderer.invoke(EventsKeys.START_UPDATE),
  on: (string: string, cb: any) => ipcRenderer.on(string, cb),
  off: (string: string, cb: any) => ipcRenderer.on(string, cb),
  close: () => ipcRenderer.send(EventsKeys.CLOSE),
  minimize: () => ipcRenderer.send(EventsKeys.MINIMIZE),
  togglePinServer: (server: ServerStore) =>
    ipcRenderer.invoke(EventsKeys.TOGGLE_PIN, server),
};

export const uiPreload = {
  toggleTheme: (newTheme: string) =>
    ipcRenderer.invoke(EventsKeys.TOGGLE_THEME, newTheme),
};

export const osItems = {
  os: os.platform(),
  getInterfaces: () =>
    ipcRenderer.invoke(EventsKeys.GET_NETWORK_INTERFACE_LIST),
};

export const storePreload = {
  get: <T extends keyof StoreKey>(key: T) => store.get<T>(key),
};

contextBridge.exposeInMainWorld("ui", uiPreload);
contextBridge.exposeInMainWorld("ipc", ipcPreload);
contextBridge.exposeInMainWorld("os", osItems);
contextBridge.exposeInMainWorld("storePreload", storePreload);
