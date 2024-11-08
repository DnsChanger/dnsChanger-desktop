import {
	app,
	BrowserWindow,
	shell,
	ipcMain,
	Tray,
	Menu,
	nativeImage,
} from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { getIconPath } from './shared/getIconPath'
import { update } from './update'
import { config } from 'dotenv'
import { store } from './store/store'
import { EventsKeys } from '../shared/constants/eventsKeys.constant'
import { getPublicFilePath } from './shared/file'
import os from 'node:os'
import Url from 'node:url'
import serve from './shared/serve'

config()
if (isDev)
	Object.defineProperty(app, 'isPackaged', {
		get() {
			return true
		},
	})

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
	? join(process.env.DIST_ELECTRON, '../public')
	: process.env.DIST

if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')

const startUrl =
	process.env.VITE_DEV_SERVER_URL ||
	Url.format({
		pathname: join(process.env.DIST, 'index.html'),
		protocol: 'file:',
		slashes: true,
	})

// const indexHtml = join(process.env.DIST, 'index.html')
const icon = nativeImage.createFromPath(getIconPath())

async function createWindow() {
	win = new BrowserWindow({
		title: 'DNS Changer',
		icon: icon,
		height: 483,
		width: 743,
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: true,
			devTools: true,
		},
		darkTheme: true,
		resizable: false,
		center: isDev === false,
		show: true,

		alwaysOnTop: isDev,
		movable: true,
		frame: false,
		titleBarStyle: 'hidden',
	})
	// hides the traffic lights

	if (os.platform() === 'darwin') win.setWindowButtonVisibility(false)

	win.setMenu(null)
	await serve(win)

	// await win.loadURL(startUrl)

	// if (url) {
	// 	await win.loadURL(url)
	// } else {
	// 	await win.loadFile(indexHtml)
	// }
	// if (isDev) win.webContents.openDevTools()

	win.webContents.openDevTools()

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url)
		return { action: 'deny' }
	})

	let tray = null
	ipcMain.on('close', (event) => {
		if (!store.get('settings').minimize_tray) return app.exit(0)
		event.preventDefault()
		win.setSkipTaskbar(false)
		if (!tray) tray = createTray()
		win.hide()
	})

	update(win, app)
	return win
}
ipcMain.on(EventsKeys.MINIMIZE, () => {
	app.focus()
	win.isMinimized() ? win.focus() : win.minimize()
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	win = null
	if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore()
		win.focus()
	}
})

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows()
	if (allWindows.length) {
		allWindows[0].focus()
	} else {
		createWindow()
	}
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	// if (process.env.VITE_DEV_SERVER_URL) {
	childWindow.loadURL(`${startUrl}#${arg}`)
	// } else {
	// 	childWindow.loadFile(indexHtml, { hash: arg })
	// }
})

import './ipc/setting'
import './ipc/ui'
import './ipc/notif'
import './ipc/dialogs'
import isDev from './shared/isDev'

function createTray() {
	const appIcon = new Tray(icon)
	const showIcon = nativeImage.createFromPath(
		getPublicFilePath('icons/show.png'),
	)
	const powerIcon = nativeImage.createFromPath(
		getPublicFilePath('icons/power.png'),
	)

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'DNS Changer',
			enabled: false,
			icon: icon.resize({ height: 19, width: 19 }),
		},
		{
			label: 'Show',
			icon: showIcon,
			click: () => {
				win.show()
				ipcMain.emit(EventsKeys.GET_CURRENT_ACTIVE)
			},
		},
		{
			label: 'Quit DNS Changer',
			icon: powerIcon,
			click: () => {
				app.exit(1)
			},
		},
	])

	appIcon.on('double-click', (event) => {
		win.show()
		ipcMain.emit(EventsKeys.GET_CURRENT_ACTIVE)
	})
	appIcon.setToolTip('DNS Changer')
	appIcon.setContextMenu(contextMenu)
	return appIcon
}
