import _ from "lodash";
import { v4 as uuid } from "uuid";
import { store } from "../store/store";
import { ipcMain, shell, dialog } from "electron";

import { autoLauncher, dnsService } from "../config";
import { ResponseMessage } from "../constant/messages.constant";
import { Server } from "../../shared/interfaces/server.interface";
import { Settings } from "../../shared/interfaces/settings.interface";
import { EventsKeys } from "../../shared/constants/eventsKeys.constant";
import { isValidDnsAddress } from "../../shared/validators/dns.validator";
import LN from "../../i18n/i18n-node";
import { Locales } from "../../i18n/i18n-types";
import pingLib from "ping";

// todo Refactoring

ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
  try {
    await dnsService.setDns(server.servers);
    const currentLng = LN[getCurrentLng()];
    return {
      server,
      success: true,
      message: currentLng.pages.home.connected({
        currentActive: server.name,
      }),
    };
  } catch (e) {
    return { server, ...errorHandling(e) };
  }
});

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
  try {
    await dnsService.clearDns();
    const currentLng = LN[getCurrentLng()];
    return {
      server,
      success: true,
      message: currentLng.pages.home.disconnected(),
    };
  } catch (e) {
    return { server, ...errorHandling(e) };
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

  const newServer: Server = {
    key: data.key || uuid(),
    name: data.name,
    avatar: data.avatar,
    servers: data.servers,
    rate: data.rate || 0,
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

ipcMain.handle(EventsKeys.GET_CURRENT_ACTIVE, async (): Promise<any> => {
  try {
    const dns: string[] = await dnsService.getActiveDns();

    if (!dns.length) return { success: false, server: null };

    const servers = store.get("dnsList") || [];
    const server: Server | null = servers.find(
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
        },
      };
    else {
      return { success: true, server };
    }
  } catch (error) {
    return errorHandling(error);
  }
});

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

function errorHandling(e: { message: string | number }) {
  // @ts-ignore
  const msg = ResponseMessage[e.message];

  return { success: false, message: msg || "unknown error" };
}

function getCurrentLng(): Locales {
  return store.get("settings").lng;
}
