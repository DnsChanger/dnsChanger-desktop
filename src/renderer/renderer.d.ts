import { ipcPreload, uiPreload } from "../preload";

declare global {
  interface Window {
    ipc: typeof ipcPreload;
    ui: typeof uiPreload;
  }
}
