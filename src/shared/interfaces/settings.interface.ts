import { Locales } from "../../i18n/i18n-types";
import { ServerStore } from "./server.interface";

export interface Settings {
  startUp: boolean;
  lng: Locales;
  autoUpdate: boolean;
  minimize_tray: boolean;
  network_interface: string | "Auto";
  use_analytic: boolean;
}

export interface SettingInStore extends Omit<Settings, "startUp"> {}

export type StoreKey = {
  dnsList: ServerStore[];
  settings: SettingInStore;
};
