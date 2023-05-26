import electronStore from "electron-store";

import { Server } from "../../shared/interfaces/server.interface";
import { serversConstant } from "../../shared/constants/servers.cosntant";
import { SettingInStore } from "../../shared/interfaces/settings.interface";

export const store = new electronStore<{
  dnsList: Server[];
  settings: SettingInStore;
}>({
  defaults: {
    dnsList: serversConstant,
    settings: {
      lng: "eng",
      autoUpdate: true,
    },
  },
  name: "dnsChangerStore_1.8.0",
});
