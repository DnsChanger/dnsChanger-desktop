import updateElectron from 'update-electron-app';
import { app, BrowserWindow, autoUpdater } from 'electron';
import ms from "ms"
import { getIconPath } from './main/shared/getIconPath';
import { setTimeout } from 'timers/promises';

updateElectron({
    logger: require('electron-log'),
    notifyUser: true
})

const server = 'https://update.electronjs.org';
const feed = `${server}/DnsChanger/dnsChanger-desktop/${process.platform}-${process.arch}/${app.getVersion()}`;

autoUpdater.setFeedURL({
    url: feed,
    serverType: 'default',
})

setInterval(() => {
    autoUpdater.checkForUpdates();
}, ms("1h"))

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const LOADING_WINDOW_WEBPACK_ENTRY: string;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (options?: Electron.BrowserWindowConstructorOptions): BrowserWindow => {
    return new BrowserWindow(options);
};


app.whenReady().then(() => {
    const icon = getIconPath();
    const isDev = !!process.env.ENV
    const mainWindow = createWindow({
        height: 600,
        width: 500,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: false,
            images: true,
        },
        darkTheme: true,
        resizable: false,
        center: true,
        icon
    })

    const loadingWindow = createWindow({
        parent: mainWindow,
        width: 400,
        height: 400,
        resizable: false,
        icon: icon,
        autoHideMenuBar: true,
        title: "loading",
        center: true,
        movable: isDev,
        titleBarStyle: "hidden",
        webPreferences: {
            images: true,
            devTools: isDev,
        }
    })

    loadingWindow.loadURL(LOADING_WINDOW_WEBPACK_ENTRY)

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.setMenu(null);

    mainWindow.on("ready-to-show", async () => {
        await setTimeout(ms("3s"))
        loadingWindow.hide()
    })

    if (isDev)
        mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

import './main/ipc/ui';
import './main/ipc/notif';
import './main/ipc/dialogs';


app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

