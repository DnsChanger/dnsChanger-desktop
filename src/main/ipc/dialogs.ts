import _ from "lodash";
import { v4 as uuid } from "uuid";
import { store } from "../store/store";
import { ipcMain, shell, dialog, BrowserWindow } from "electron";

import { dnsService } from "../config";
import { Server, ServerStore } from "../../shared/interfaces/server.interface";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";
import { isValidDnsAddress } from "../../shared/validators/dns.validator";
import LN from "../../i18n/i18n-node";
import { Locales } from "../../i18n/i18n-types";
import pingLib from "ping";
import { userLogger } from "../shared/logger";
import { getOverlayIcon } from "../shared/file";
import { updateOverlayIcon } from "../shared/overlayIcon";
import { trackEvent } from "@aptabase/electron/main";

// todo Refactoring

ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
  try {
    await dnsService.setDns(server.servers);
    const currentLng = LN[getCurrentLng()];
    const win = BrowserWindow.getAllWindows()[0];
    const filepath = await getOverlayIcon(server);
    updateOverlayIcon(win, filepath, "connected");

    if (store.get("settings").use_analytic)
      trackEvent(`USE_DNS:${server.name}`, {
        servers: server.servers.toString(),
      }).catch();
    return {
      server,
      success: true,
      message: currentLng.pages.home.connected({
        currentActive: server.name,
      }),
    };
  } catch (e: any) {
    userLogger.error(e.stack, e.message);
    return {
      server,
      success: false,
      message: "Unknown error while connecting",
    };
  }
});

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
  try {
    await dnsService.clearDns();
    const currentLng = LN[getCurrentLng()];
    const win = BrowserWindow.getAllWindows()[0];
    updateOverlayIcon(win, null, "disconnect");
    return {
      server,
      success: true,
      message: currentLng.pages.home.disconnected(),
    };
  } catch (e: any) {
    userLogger.error(e.stack, e.message);
    return { server, success: false, message: "Unknown error while clear DNS" };
  }
});

ipcMain.handle(EventsKeys.ADD_DNS, async (event, data: Partial<Server>) => {
  // validators ..
  const nameServer1 = data.servers[0];
  const nameServer2 = data.servers[1];

  const currentLng = LN[getCurrentLng()];

  if (!isValidDnsAddress(nameServer1))
    return { success: false, message: currentLng.validator.invalid_dns1 };

  if (nameServer2 && !isValidDnsAddress(nameServer2))
    return { success: false, message: currentLng.validator.invalid_dns2 };

  if (nameServer1.toString() == nameServer2.toString())
    return {
      success: false,
      message: currentLng.validator.dns1_dns2_duplicates,
    };

  const newServer: ServerStore = {
    key: data.key || uuid(),
    name: data.name,
    avatar: data.avatar,
    servers: data.servers,
    rate: data.rate || 0,
    tags: data.tags || [],
    isPin: false,
  };

  const list: Server[] = store.get("dnsList") || [];
  const isDupKey = list.find((s) => s.key == newServer.key);
  if (isDupKey) newServer.key = uuid();

  list.push(newServer);

  store.set("dnsList", list);
  return { success: true, server: newServer, servers: list };
});

ipcMain.handle(EventsKeys.DELETE_DNS, (ev: any, server: Server) => {
  const dnsList = store.get("dnsList");

  _.remove(dnsList, (dns) => dns.key === server.key);

  store.set("dnsList", dnsList);

  return {
    success: true,
    servers: dnsList,
  };
});

ipcMain.handle(
  EventsKeys.RELOAD_SERVER_LIST,
  async (event, servers: Server[]) => {
    store.set("dnsList", servers);
    return { success: true };
  }
);

ipcMain.handle(EventsKeys.FETCH_DNS_LIST, () => {
  const servers = store.get("dnsList") || [];
  return { success: true, servers: servers };
});

ipcMain.on(EventsKeys.GET_CURRENT_ACTIVE, getCurrentActive);
ipcMain.handle(EventsKeys.GET_CURRENT_ACTIVE, getCurrentActive);

ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
  shell.openExternal(url);
});

ipcMain.on(
  EventsKeys.DIALOG_ERROR,
  (ev: any, title: string, message: string) => {
    dialog.showErrorBox(title, message);
  }
);

ipcMain.handle(EventsKeys.FLUSHDNS, async function (evet, _: any) {
  try {
    await dnsService.flushDns();
    return { success: true };
  } catch {
    return { success: false };
  }
});

ipcMain.handle(EventsKeys.PING, async function (event, server: Server) {
  try {
    const result = await pingLib.promise.probe(server.servers[0], {
      timeout: 10,
    });
    return {
      success: true,
      data: {
        alive: result.alive,
        time: result.time,
      },
    };
  } catch {
    return {
      success: false,
    };
  }
});
ipcMain.handle(EventsKeys.TOGGLE_PIN, async function (event, server: Server) {
  const dnsList: ServerStore[] = store.get("dnsList");
  const serverStore = dnsList.find((ser) => ser.key === server.key);
  if (serverStore) {
    serverStore.isPin = !serverStore.isPin;
    store.set("dnsList", dnsList);

    return {
      success: true,
      servers: dnsList,
    };
  }
});

ipcMain.handle(EventsKeys.GET_NETWORK_INTERFACE_LIST, () => {
  return dnsService.getInterfacesList();
});
function getCurrentLng(): Locales {
  return store.get("settings").lng;
}
async function getCurrentActive(): Promise<any> {
  try {
    const dns: string[] = await dnsService.getActiveDns();

    if (!dns.length) return { success: false, server: null };

    const servers = store.get("dnsList") || [];
    const server: ServerStore | null = servers.find(
      (server) => server.servers.toString() == dns.toString()
    );

    if (!server)
      return {
        success: true,
        server: {
          key: "unknown",
          servers: dns,
          names: {
            eng: "unknown",
            fa: "unknown",
          },
          avatar: "",
          isPin: false,
        },
      };
    else {
      const win = BrowserWindow.getAllWindows()[0];
      const filepath = await getOverlayIcon(server);
      updateOverlayIcon(win, filepath, "connected");
      return { success: true, server };
    }
  } catch (e: any) {
    userLogger.error(e.stack, e.message);
    return { success: false, message: "Unknown error while clear DNS" };
  }
}
