import {Notification, Tray, ipcMain, nativeImage} from "electron";
import {EventsKeys} from "../../shared/constants/eventsKeys.constant";

ipcMain.on(EventsKeys.NOTIFICATION, (_event, data) => {
    const appIcon = nativeImage.createFromPath("./assets/logo.png")
    new Notification({title: "DNS Changer", body: data, icon: appIcon}).show()
})
