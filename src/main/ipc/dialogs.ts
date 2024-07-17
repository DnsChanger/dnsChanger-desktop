import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { ipcMain, shell, dialog, BrowserWindow } from 'electron'
import pingLib from 'ping'

import { store } from '../store/store'
import { dnsService } from '../config'
import { Server, ServerStore } from '../../shared/interfaces/server.interface'
import { EventsKeys } from '../../shared/constants/eventsKeys.constant'
import { isValidDnsAddress } from '../../shared/validators/dns.validator'
import LN from '../../i18n/i18n-node'
import { Locales } from '../../i18n/i18n-types'
import { getLoggerPathFile, LogId, userLogger } from '../shared/logger'
import { getOverlayIcon } from '../shared/file'
import { updateOverlayIcon } from '../shared/overlayIcon'

ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
  try {
    await dnsService.setDns(server.servers)
    const currentLng = LN[getCurrentLng()]
    const win = BrowserWindow.getAllWindows()[0]
    const filepath = await getOverlayIcon(server)
    updateOverlayIcon(win, filepath, 'connected')

    return {
      server,
      success: true,
      message: currentLng.pages.home.connected({
        currentActive: server.name
      })
    }
  } catch (e) {
    userLogger.error(e.stack, e.message)
    return {
      server,
      success: false,
      message: 'Unknown error while connecting'
    }
  }
})

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
  try {
    await dnsService.clearDns()

    const currentLng = LN[getCurrentLng()]
    const win = BrowserWindow.getAllWindows()[0]

    updateOverlayIcon(win, null, 'disconnect')
    const defaultServer = store.get('defaultServer')

    if (defaultServer) {
      const servers = defaultServer.servers
      dnsService.setDns(servers).catch(err => {
        userLogger.error(err.stack, err.message)
      })
    }

    return {
      server,
      success: true,
      message: currentLng.pages.home.disconnected()
    }
  } catch (e) {
    userLogger.error(e.stack, e.message)
    return { server, success: false, message: 'Unknown error while clearing DNS' }
  }
})

ipcMain.handle(EventsKeys.ADD_DNS, async (event, data: Partial<Server>) => {
  if (data.name === 'default') {
    const defaultServer = store.get('defaultServer')
    const server: Server = {
      key: 'default',
      servers: data.servers,
      name: 'default',
      tags: [],
      avatar: '',
      rate: 0
    }

    if (!defaultServer) {
      store.set('defaultServer', server)
    } else {
      defaultServer.servers = data.servers
      store.set('defaultServer', defaultServer)
    }

    return { success: true, server: server }
  }

  const [ nameServer1, nameserver2 ] = data.servers
  if (!nameServer1) return { success: false, message: 'DNS1 is required' }

  const currentLng = LN[getCurrentLng()]

  if (!isValidDnsAddress(nameServer1)) return { success: false, message: currentLng.validator.invalid_dns1 }

  if (nameServer2 && !isValidDnsAddress(nameServer2))
    return { success: false, message: currentLng.validator.invalid_dns2 }

  if (nameServer1.toString() == nameServer2.toString())
    return {
      success: false,
      message: currentLng.validator.dns1_dns2_duplicates
    }

  const list: Server[] = store.get('dnsList') || []

  const newServer: ServerStore = {
    key: data.key || uuid(),
    name: data.name,
    avatar: data.avatar,
    servers: data.servers,
    rate: data.rate || 0,
    tags: data.tags || [],
    isPin: false
  }

  const isDupKey = list.find(s => s.key == newServer.key)
  if (isDupKey) newServer.key = uuid()

  list.push(newServer)

  store.set('dnsList', list)
  return { success: true, server: newServer, servers: list }
})

ipcMain.handle(EventsKeys.DELETE_DNS, (ev, server: Server) => {
  const dnsList = store.get('dnsList')

  _.remove(dnsList, dns => dns.key === server.key)

  store.set('dnsList', dnsList)

  return {
    success: true,
    servers: dnsList
  }
})

ipcMain.handle(EventsKeys.RELOAD_SERVER_LIST, async (event, servers: Server[]) => {
  store.set('dnsList', servers)
  return { success: true }
})

ipcMain.handle(EventsKeys.FETCH_DNS_LIST, () => {
  const servers = store.get('dnsList') || []
  return { success: true, servers: servers }
})

ipcMain.on(EventsKeys.GET_CURRENT_ACTIVE, getCurrentActive)

ipcMain.handle(EventsKeys.GET_CURRENT_ACTIVE, getCurrentActive)

ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
  shell.openExternal(url)
})

ipcMain.on(EventsKeys.OPEN_DEV_TOOLS, () => {
  try {
    const win = BrowserWindow.getAllWindows()[0]
    win.webContents.openDevTools()
  } catch (e) {}
})

// open log file
ipcMain.on(EventsKeys.OPEN_LOG_FILE, () => {
  const logPathFile = getLoggerPathFile(LogId.USER)
  shell.openPath(logPathFile).catch(e => {
    userLogger.error(e.stack, e.message)
  })
})

ipcMain.on(EventsKeys.DIALOG_ERROR, (ev, title: string, message: string) => {
  dialog.showErrorBox(title, message)
})

ipcMain.handle(EventsKeys.FLUSHDNS, async function () {
  try {
    await dnsService.flushDns()
    return { success: true }
  } catch (error) {
    userLogger.error(error.stack, error.message)
    return { success: false }
  }
})

ipcMain.handle(EventsKeys.PING, async function (event, server: Server) {
  try {
    const result = await pingLib.promise.probe(server.servers[0], {
      timeout: 10
    })
    return {
      success: true,
      data: {
        alive: result.alive,
        time: result.time
      }
    }
  } catch {
    return {
      success: false
    }
  }
})
ipcMain.handle(EventsKeys.TOGGLE_PIN, async function (event, server: Server) {
  const dnsList: ServerStore[] = store.get('dnsList')

  const serverStore = dnsList.find(ser => ser.key === server.key)
  if (serverStore) {
    serverStore.isPin = !serverStore.isPin
    store.set('dnsList', dnsList)

    return {
      success: true,
      servers: dnsList
    }
  }
})

ipcMain.handle(EventsKeys.GET_NETWORK_INTERFACE_LIST, () => {
  return dnsService.getInterfacesList()
})

function getCurrentLng(): Locales {
  return store.get('settings').lng
}

async function getCurrentActive(): Promise<{
  success: boolean
  server?: Partial<ServerStore>
  isDefault?: boolean
  message?: string
}> {
  try {
    const dns: string[] = await dnsService.getActiveDns()

    if (!dns.length) return { success: false, server: null }

    const servers = store.get('dnsList') || []
    const server: ServerStore | null = servers.find(server => server.servers.toString() == dns.toString())
    const defaultServer = store.get('defaultServer')
    if (defaultServer) {
      // if default server is connected, then return it as not connected
      if (defaultServer.servers.toString() == dns.toString()) {
        return {
          success: false,
          server: null,
          isDefault: true
        }
      }
    }
    if (!server)
      return {
        success: true,
        server: {
          key: 'unknown',
          servers: dns,
          names: {
            eng: 'unknown',
            fa: 'unknown'
          },
          avatar: '',
          isPin: false
        }
      }
    else {
      const win = BrowserWindow.getAllWindows()[0]

      const filepath = await getOverlayIcon(server)

      updateOverlayIcon(win, filepath, 'connected')

      return { success: true, server }
    }
  } catch (e) {
    userLogger.error(e.stack, e.message)
    return { success: false, message: 'Unknown error while clear DNS' }
  }
}
