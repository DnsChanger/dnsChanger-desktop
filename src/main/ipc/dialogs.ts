import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import _ from 'lodash'
import pingLib from 'ping'
import { v4 as uuid } from 'uuid'

import LN from '../../i18n/i18n-node'
import type { Locales } from '../../i18n/i18n-types'
import { EventsKeys } from '../../shared/constants/eventsKeys.constant'
import type { Server, ServerStore } from '../../shared/interfaces/server.interface'
import { validateServerAddresses } from '../../shared/validators/dns.validator'
import { dnsService } from '../config'
import { getOverlayIcon } from '../shared/file'
import { LogId, getLoggerPathFile, userLogger } from '../shared/logger'
import { updateOverlayIcon } from '../shared/overlayIcon'
import { isWindows } from '../shared/platform'
import { store } from '../store/store'

ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
	try {
		await dnsService.setDns(server)
		const currentLng = LN[getCurrentLng()]
		const win = BrowserWindow.getAllWindows()[0]
		const filepath = await getOverlayIcon(server)
		updateOverlayIcon(win, filepath, 'connected')

		return {
			server,
			success: true,
			message: currentLng.pages.home.connected({
				currentActive: server.name,
			}),
		}
	} catch (e: any) {
		userLogger.error(e.stack, e.message)
		return {
			server,
			success: false,
			message: e?.message || 'Unknown error while connecting',
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
			dnsService.setDns(defaultServer).catch((err) => {
				userLogger.error(err.stack, err.message)
			})
		}

		return {
			server,
			success: true,
			message: currentLng.pages.home.disconnected(),
		}
	} catch (e: any) {
		userLogger.error(e.stack, e.message)
		return { server, success: false, message: 'Unknown error while clear DNS' }
	}
})

ipcMain.handle(EventsKeys.ADD_DNS, async (event, data: Partial<Server>) => {
	if (data.name === 'default') {
		const defaultServer = store.get('defaultServer')
		const server: Server = {
			key: 'default',
			servers: data.servers || [],
			name: 'default',
			tags: [],
			avatar: '',
			rate: 0,
			protocol: 'plain',
		}

		if (!defaultServer) {
			store.set('defaultServer', server)
		} else {
			defaultServer.servers = data.servers || []
			store.set('defaultServer', defaultServer)
		}

		return { success: true, server: server }
	}

	const currentLng = LN[getCurrentLng()]
	const validationError = validateServerAddresses(data)
	if (validationError) {
		if (validationError.includes('DNS1')) {
			return { success: false, message: currentLng.validator.invalid_dns1 }
		}
		if (validationError.includes('DNS2') || validationError.includes('Alternate')) {
			return { success: false, message: currentLng.validator.invalid_dns2 }
		}
		if (validationError.includes('duplicates')) {
			return {
				success: false,
				message: currentLng.validator.dns1_dns2_duplicates,
			}
		}
		return { success: false, message: validationError }
	}

	const list: Server[] = store.get('dnsList') || []

	const newServer: ServerStore = {
		key: data.key || uuid(),
		name: data.name!,
		avatar: data.avatar || '',
		servers: data.servers || [],
		rate: data.rate || 0,
		tags: data.tags || [],
		isPin: false,
		protocol: data.protocol || 'plain',
		dohUrl: data.dohUrl,
		dotHost: data.dotHost,
	}

	const isDupKey = list.find((s) => s.key === newServer.key)
	if (isDupKey) newServer.key = uuid()

	list.push(newServer)

	store.set('dnsList', list)
	return { success: true, server: newServer, servers: list }
})

ipcMain.handle(EventsKeys.DELETE_DNS, (ev, server: Server) => {
	const dnsList = store.get('dnsList')

	_.remove(dnsList, (dns) => dns.key === server.key)

	store.set('dnsList', dnsList)

	return {
		success: true,
		servers: dnsList,
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
	shell.openPath(logPathFile).catch((e) => {
		userLogger.error(e.stack, e.message)
	})
})

ipcMain.on(EventsKeys.DIALOG_ERROR, (ev, title: string, message: string) => {
	dialog.showErrorBox(title, message)
})

ipcMain.handle(EventsKeys.FLUSHDNS, async () => {
	try {
		await dnsService.flushDns()
		return { success: true }
	} catch (error) {
		userLogger.error(error.stack, error.message)
		return { success: false }
	}
})

ipcMain.handle(EventsKeys.PING, async (event, server: Server) => {
	try {
		const target =
			server.servers?.[0] ||
			(server.dohUrl ? new URL(server.dohUrl).hostname : null) ||
			server.dotHost?.split(':')[0]

		if (!target) {
			return { success: false }
		}

		const result = await pingLib.promise.probe(target, {
			timeout: 10,
		})
		return {
			success: true,
			data: {
				alive: result.alive,
				time: result.time,
			},
		}
	} catch {
		return {
			success: false,
		}
	}
})
ipcMain.handle(EventsKeys.TOGGLE_PIN, async (event, server: Server) => {
	const dnsList: ServerStore[] = store.get('dnsList')

	const serverStore = dnsList.find((ser) => ser.key === server.key)
	if (serverStore) {
		serverStore.isPin = !serverStore.isPin
		store.set('dnsList', dnsList)

		return {
			success: true,
			servers: dnsList,
		}
	}
})

ipcMain.handle(EventsKeys.GET_NETWORK_INTERFACE_LIST, async () => {
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
		const encrypted = dnsService.getActiveEncryptedConnection()
		if (encrypted) {
			const servers = store.get('dnsList') || []
			const server = servers.find((item) => item.key === encrypted.key)
			if (server) {
				const win = BrowserWindow.getAllWindows()[0]
				const filepath = await getOverlayIcon(server)
				updateOverlayIcon(win, filepath, 'connected')
				return { success: true, server }
			}
			return {
				success: true,
				server: {
					key: encrypted.key,
					name: encrypted.protocol.toUpperCase(),
					servers: encrypted.bootstrap,
					protocol: encrypted.protocol,
					dohUrl: encrypted.dohUrl,
					dotHost: encrypted.dotHost,
					avatar: '',
					isPin: false,
				},
			}
		}

		const dns: string[] = await dnsService.getActiveDns()

		if (!dns.length) return { success: false, server: null }

		const servers = store.get('dnsList') || []
		const server: ServerStore | null = servers.find(
			(server) => server.servers.toString() === dns.toString()
		)
		const defaultServer = store.get('defaultServer')
		if (defaultServer) {
			// if default server is connected, then return it as not connected
			if (defaultServer.servers.toString() === dns.toString()) {
				return {
					success: false,
					server: null,
					isDefault: true,
				}
			}
		}
		if (!server) {
			return {
				success: true,
				server: {
					key: 'unknown',
					servers: dns,
					names: {
						eng: 'unknown',
						fa: 'unknown',
					},
					avatar: '',
					isPin: false,
				},
			}
		}

		const win = BrowserWindow.getAllWindows()[0]

		const filepath = await getOverlayIcon(server)

		updateOverlayIcon(win, filepath, 'connected')

		return { success: true, server }
	} catch (e: any) {
		userLogger.error(e.stack, e.message)
		return { success: false, message: 'Unknown error while clear DNS' }
	}
}
