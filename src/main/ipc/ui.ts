import { EventsKeys } from "../../shared/constants/eventsKeys.constant"
import { ipcMain, nativeTheme } from 'electron';

ipcMain.on(EventsKeys.TOGGLE_THEME, (_event, data) => {
    nativeTheme.themeSource = data
})
