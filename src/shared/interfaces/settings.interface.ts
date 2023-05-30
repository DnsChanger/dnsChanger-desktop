import { Locales } from "../../i18n/i18n-types";

export interface Settings {
  startUp: boolean;
  lng: Locales;
  autoUpdate: boolean;
}

export interface SettingInStore extends Omit<Settings, "startUp"> {}
