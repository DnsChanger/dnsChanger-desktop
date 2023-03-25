import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { store } from '../store/store';
import { ipcMain, shell, dialog } from 'electron';

import { autoLauncher, dnsService } from '../config';
import { ResponseMessage } from '../constant/messages.constant';
import { Server } from '../../shared/interfaces/server.interface';
import { Settings } from '../../shared/interfaces/settings.interface';
import { EventsKeys } from '../../shared/constants/eventsKeys.constant';
import { isValidDnsAddress } from '../../shared/validators/dns.validator';

// todo Refactoring


ipcMain.handle(EventsKeys.SET_DNS, async (event, server: Server) => {
    try {
        await dnsService.setDns(server.servers);
        return { server, success: true };
    } catch (e) {
        return { server, ...errorHandling(e) };
    }
})

ipcMain.handle(EventsKeys.CLEAR_DNS, async (event, server: Server) => {
    try {
        await dnsService.clearDns();
        return { server, success: true, message: 'SUCCESSFUL' };
    } catch (e) {
        return { server, ...errorHandling(e) };
    }
})

ipcMain.handle(EventsKeys.ADD_DNS, async (event, data) => {
    // validators ..
    const nameServer1 = data.nameServers[0];
    const nameServer2 = data.nameServers[1];

    if (!isValidDnsAddress(nameServer1))
        return { success: false, message: 'invalid_dns1' };

    if (nameServer2 && !isValidDnsAddress(nameServer2))
        return { success: false, message: 'invalid_dns2' };

    if (nameServer1.toString() == nameServer2.toString())
        return { success: false, message: 'dns1_dns2_duplicates' };

    const newServer: Server = {
        key: uuid(),
        names: {
            eng: data.name,
            fa: data.name
        },
        avatar: '',
        servers: data.nameServers
    }

    const list: Server[] = store.get('dnsList') || [];
    list.push(newServer);

    store.set('dnsList', list);
    return { success: true, server: newServer };
})

ipcMain.handle(EventsKeys.RELOAD_SERVER_LIST, async (event, servers: Server[]) => {
    store.set('dnsList', servers);
    return { success: true };
})

ipcMain.handle(EventsKeys.FETCH_DNS_LIST, () => {
    const servers = store.get('dnsList') || [];
    return { success: true, servers: servers };
})

ipcMain.handle(EventsKeys.GET_CURRENT_ACTIVE, async (): Promise<any> => {
    try {
        const dns: string[] = await dnsService.getActiveDns();

        if (!dns.length)
            return { success: false, server: null };

        const servers = store.get('dnsList') || [];
        const server: Server | null = servers.find((server) => server.servers.toString() == dns.toString());

        if (!server)
            return {
                success: true, server: {
                    key: 'unknown',
                    servers: dns,
                    names: {
                        eng: 'unknown',
                        fa: 'unknown'
                    },
                    avatar: ''
                }
            }
        else {
            return { success: true, server }
        }
    } catch (error) {
        return errorHandling(error)
    }
})

ipcMain.handle(EventsKeys.GET_SETTINGS, async () => {
    const settings: Settings = {
        startUp: false,
        lng: store.get("settings").lng
    }

    settings.startUp = await autoLauncher.isEnabled()
    return settings
})

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
})

ipcMain.on(EventsKeys.OPEN_BROWSER, (ev, url) => {
    shell.openExternal(url);
})

ipcMain.on(EventsKeys.DIALOG_ERROR, (ev: any, title: string, message: string) => {
    dialog.showErrorBox(title, message);
})

ipcMain.handle(EventsKeys.DELETE_DNS, (ev: any, server: Server) => {
    const dnsList = store.get('dnsList');

    _.remove(dnsList, dns => dns.key === server.key);

    store.set('dnsList', dnsList);

    return {
        success: true,
        servers: dnsList
    };
})
ipcMain.handle(EventsKeys.SAVE_SETTINGS, function (event, data: Settings) {
    store.set("settings", data)
    return { success: true }
})
function errorHandling(e: { message: string | number; }) {
    // @ts-ignore
    const msg = ResponseMessage[e.message]

    return { success: false, message: msg || 'unknown error' };
}


