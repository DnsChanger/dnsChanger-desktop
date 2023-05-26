import { autoUpdater } from "electron-updater";
export async function update(win: Electron.BrowserWindow, app: Electron.App) {
  // autoUpdater.autoDownload = false; //todo get from store
  // autoUpdater.disableWebInstaller = false;
  // autoUpdater.allowDowngrade = false;
  //
  // const server = "https://update.electronjs.org";
  // const feed = `${server}/DnsChanger/dnsChanger-desktop/${process.platform}-${
  //   process.arch
  // }/${app.getVersion()}`;
  //
  // autoUpdater.setFeedURL({
  //   provider: "github",
  //   channel: "RELEASES",
  //   private: true,
  //   owner: "sajjadmrx",
  //   repo: "test-electron-updater",
  //   token: "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",
  // });
  //
  // autoUpdater.on("checking-for-update", function () {
  //   console.log("checking....");
  // });
  //
  // autoUpdater.on("update-available", (arg) => {
  //   console.log(26, arg);
  //   // win.webContents.send('update-can-available', { update: true, version: app.getVersion(), newVersion: arg?.version })
  // });
  //
  // autoUpdater.on("update-not-available", (arg) => {
  //   console.log(17, arg);
  //
  //   //  win.webContents.send('update-can-available', { update: false, version: app.getVersion(), newVersion: arg?.version })
  // });
  // autoUpdater.on("error", console.log);
  // autoUpdater.on("download-progress", (info) => console.log);
  // try {
  //   return await autoUpdater.checkForUpdatesAndNotify();
  // } catch (error) {
  //   return { message: "Network error", error };
  // }
}
