import { ipcMain, nativeTheme } from "electron";

import { EventsKeys } from "../../shared/constants/eventsKeys.constant";

ipcMain.handle(EventsKeys.TOGGLE_THEME, (_event, data) => {
  nativeTheme.themeSource = data;
  return nativeTheme.shouldUseDarkColors
});
