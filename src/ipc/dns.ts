import {ipcMain} from "electron";
import {Server} from "../constants/servers.cosntant";

ipcMain.on("set-dns", (event, server: Server) => {
    console.log("set-dns", server);
    event.reply("set-dns", {server, message: "success"})
})

