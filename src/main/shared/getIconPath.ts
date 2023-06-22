import path from "path";
import { join } from "node:path";

export function getIconPath(): string {
  let icon;
  switch (process.platform) {
    case "win32":
      icon = path.join(process.env.PUBLIC, "icons/icon.ico");
      break;
    case "darwin":
      icon = path.join(process.env.PUBLIC, "icons/icon.ico");
      break;
    case "linux":
      icon = path.join(process.env.PUBLIC, "icons/icon.png");
      break;
    default:
      icon = path.join(process.env.PUBLIC, "icons/icon.ico");
      break;
  }
  return icon;
}
