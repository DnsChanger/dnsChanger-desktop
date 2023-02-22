import { Notification, Tray, ipcMain, nativeImage } from "electron";
ipcMain.on("notif", (_event, data) => {
    const appIcon = nativeImage.createFromPath("./assets/logo.png")
    new Notification({ title: "DNS Changer", body: data, icon: appIcon }).show()
})