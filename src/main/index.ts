import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Tray,
  Menu,
  nativeImage,
} from "electron";
import { release } from "node:os";
import path, { join } from "node:path";
import { getIconPath } from "./shared/getIconPath";
import { update } from "./update";
import { config } from "dotenv";
import isDev from "electron-is-dev";
import { store } from "./store/store";

config();
if (isDev)
  Object.defineProperty(app, "isPackaged", {
    get() {
      return true;
    },
  });

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

if (release().startsWith("6.1")) app.disableHardwareAcceleration();

if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const icon = nativeImage.createFromPath(getIconPath());

async function createWindow() {
  win = new BrowserWindow({
    title: "DNS Changer",
    icon: icon,
    height: 483,
    width: 743,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
      devTools: isDev,
    },
    darkTheme: true,
    resizable: false,
    center: !isDev, // => false
    show: true,
    alwaysOnTop: isDev,
  });
  win.setMenu(null);
  if (url) {
    await win.loadURL(url);
  } else {
    await win.loadFile(indexHtml);
  }
  if (isDev) win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  let tray = null;
  win.on("close", function (event) {
    if (!store.get("settings").minimize_tray) return app.exit(0);
    event.preventDefault();
    win.setSkipTaskbar(false);
    if (!tray) tray = createTray();
    win.hide();
  });

  return win;
  update(win, app);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

import "./ipc/setting";
import "./ipc/ui";
import "./ipc/notif";
import "./ipc/dialogs";

function createTray() {
  let appIcon = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function () {
        win.show();
      },
    },
    {
      label: "Exit",
      click: function () {
        app.exit(1);
      },
    },
  ]);

  appIcon.on("double-click", function (event) {
    win.show();
  });
  appIcon.setToolTip("DNS Changer");
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}
