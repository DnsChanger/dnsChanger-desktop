import { app, ipcMain } from "electron";
import { store } from "../store/store";
import { autoLauncher } from "../config";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";

import { Settings } from "../../shared/interfaces/settings.interface";

ipcMain.handle(EventsKeys.SAVE_SETTINGS, function (event, data: Settings) {
  store.set("settings", data);
  return { success: true, data };
});

ipcMain.handle(EventsKeys.TOGGLE_START_UP, async () => {
  try {
    const setting = store.get("settings");

    setting.startUp = !setting.startUp; //toggle
    console.log(setting.startUp);
    app.setLoginItemSettings({
      openAtLogin: setting.startUp,
      path: app.getPath("exe"),
    });

    store.set("settings", setting);

    return setting.startUp;
  } catch {}
});

ipcMain.handle(EventsKeys.GET_SETTINGS, async () => {
  const settings: Settings = store.get("settings");
  console.log(settings);
  return settings;
});
