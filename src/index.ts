import { app, BrowserWindow, autoUpdater, dialog } from 'electron';
import updateElectron from "update-electron-app"
import { getIconPath } from './main/shared/getIconPath';

updateElectron({
    repo: 'github.com/DnsChanger/dnsChanger-desktop',
    updateInterval: '1 hour',
    logger: require('electron-log'),
    notifyUser: true
})
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = (): void => {
    const icon = getIconPath()
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 500,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        darkTheme: true,
        resizable: false,
        icon
    });

    mainWindow.setMenu(null)

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // Open the DevTools.
    if (process.env.ENV)
        mainWindow.webContents.openDevTools();

};


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

import "./main/ipc/dialogs"
import "./main/ipc/notif"
import "./main/ipc/ui"

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});




autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
            'A new version has been downloaded. Restart the application to apply the updates.',
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})
