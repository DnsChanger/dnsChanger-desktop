import { BrowserWindow, nativeImage } from "electron";

export function updateOverlayIcon(
  win: BrowserWindow,
  filePath: string | null,
  description: string | "connected" | "disconnect"
) {
  const icon = filePath ? nativeImage.createFromPath(filePath) : null;
  win.setOverlayIcon(icon, description);
}
