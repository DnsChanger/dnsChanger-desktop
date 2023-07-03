import {
  autoUpdater,
  UpdateCheckResult,
  UpdateDownloadedEvent,
} from "electron-updater";
import { ipcMain } from "electron";
import { EventsKeys } from "../shared/constants/eventsKeys.constant";
import { ProgressInfo } from "electron-builder";
import * as path from "path";
import isDev from "electron-is-dev";
import { store } from "./store/store";
import ms from "ms";
export function update(win: Electron.BrowserWindow, app: Electron.App) {
  autoUpdater.autoDownload = store.get("settings").autoUpdate;
  autoUpdater.disableWebInstaller = false;

  if (isDev) autoUpdater.updateConfigPath = path.resolve("dev-app-update.yml");

  autoUpdater.allowDowngrade = false;
  autoUpdater.fullChangelog = true;

  autoUpdater.logger = require("electron-log");

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "DnsChanger",
    repo: "dnsChanger-desktop",
  });

  autoUpdater.on("checking-for-update", function () {
    autoUpdater.logger.info("checking....");
  });

  autoUpdater.on("update-available", (arg) => {
    win.webContents.send("update-can-available", {
      update: true,
      version: app.getVersion(),
      notes: arg.releaseNotes,
      newVersion: arg?.version,
    });
  });

  autoUpdater.on("update-not-available", (arg) => {
    win.webContents.send("update-can-available", {
      update: false,
      version: app.getVersion(),
      newVersion: arg?.version,
    });
    autoUpdater.logger.info("update not found");
  });

  autoUpdater.on("error", (x) => {
    autoUpdater.logger.error(x.message);
  });

  autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.quitAndInstall(false, true);
  });

  ipcMain.handle(EventsKeys.CHECK_UPDATE, async () => {
    if (!app.isPackaged) {
      const error = new Error(
        "The update feature is only available after the package."
      );
      return { message: error.message, error };
    }

    try {
      const update: UpdateCheckResult = await autoUpdater.checkForUpdates();

      return { updateInfo: update?.updateInfo || null };
    } catch (error: any) {
      autoUpdater.logger.error(error.message);
      return { message: "Network error", error, isError: true };
    }
  });

  ipcMain.handle(EventsKeys.START_UPDATE, async (event, args) => {
    startDownload(
      (error: Error | null, progressInfo: ProgressInfo) => {
        if (error) {
          event.sender.send(EventsKeys.UPDATE_ERROR, {
            message: error.message,
            error,
          });
        } else {
          autoUpdater.logger.info(progressInfo);
          event.sender.send(EventsKeys.UPDATE_PROGRESS, progressInfo);
        }
      },
      () => autoUpdater.quitAndInstall(false, true)
    );
  });
  async function checkUpdate() {
    try {
      if (autoUpdater.autoDownload) {
        autoUpdater.logger.info("start Checking Update...");
        return await autoUpdater.checkForUpdates();
      }
    } catch (error: any) {
      autoUpdater.logger.error(error.message);
    }
  }
  if (autoUpdater.autoDownload && !isDev) {
    checkUpdate();
    setInterval(() => {
      autoUpdater.autoDownload = store.get("settings").autoUpdate;
      checkUpdate();
    }, ms("2h"));
  }
}

type cb = (error: Error | null, info: ProgressInfo | null) => void;
type complete = (event: UpdateDownloadedEvent) => void;
function startDownload(callback: cb, complete: complete) {
  autoUpdater.on("download-progress", (info) => callback(null, info));
  autoUpdater.on("error", (err) => callback(err, null));
  autoUpdater.on("update-downloaded", complete);
  autoUpdater.downloadUpdate().catch((e) => callback(e, null));
}
