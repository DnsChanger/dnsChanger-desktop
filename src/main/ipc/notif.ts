import { Notification, Tray, ipcMain } from "electron";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";
import { getIconPath } from '../shared/getIconPath';

ipcMain.on(EventsKeys.NOTIFICATION, (_event, data) => {
    const icon = getIconPath()
    new Notification({ title: "DNS Changer", body: data, icon }).show();
})
