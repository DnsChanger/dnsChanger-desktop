import { Locales } from "../../i18n/i18n-types";

export interface Settings {
  startUp: boolean;
  lng: Locales;
  autoUpdate: boolean;
  minimize_tray: boolean;
  network_interface: string | "Auto";
}

export interface SettingInStore extends Omit<Settings, "startUp"> {}
