import { ipcMain } from "electron";
import { store } from "../store/store";
import { autoLauncher } from "../config";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";

import { Settings } from "../../shared/interfaces/settings.interface";

ipcMain.handle(EventsKeys.SAVE_SETTINGS, function (event, data: Settings) {
  store.set("settings", data);
  return { success: true, data };
});
ipcMain.handle(EventsKeys.TOGGLE_START_UP, async () => {
  let startUp = await autoLauncher.isEnabled();

  if (startUp) {
    await autoLauncher.disable();
    startUp = false;
  } else {
    await autoLauncher.enable();
    startUp = true;
  }

  return startUp;
});

ipcMain.handle(EventsKeys.GET_SETTINGS, async () => {
  const settings: Settings = {
    startUp: false,
    ...store.get("settings"),
  };

  settings.startUp = await autoLauncher.isEnabled();
  return settings;
});
