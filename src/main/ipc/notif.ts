import { Notification, ipcMain } from "electron";

import { getIconPath } from "../shared/getIconPath";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";

ipcMain.on(EventsKeys.NOTIFICATION, (_event, data) => {
  const icon = getIconPath();
  new Notification({ title: "DNS Changer", body: data, icon }).show();
});
