import {Notification, Tray, ipcMain, nativeImage} from "electron";
import {EventsKeys} from "../../shared/constants/eventsKeys.constant";
import process from "process";
import path from "path";

ipcMain.on(EventsKeys.NOTIFICATION, (_event, data) => {
    let icon;

    switch (process.platform) {
        case 'win32': icon = path.resolve(__dirname, 'assets', 'icon.png'); break;
        case 'darwin': icon = path.resolve(__dirname, 'assets', 'icon.ico'); break;
        case 'linux': icon = path.resolve(__dirname, 'assets', 'icon.png'); break;
        default : icon = path.resolve(__dirname, 'assets', 'icon.png'); break;
    }

    new Notification({ title: "DNS Changer", body: data, icon }).show();
})
