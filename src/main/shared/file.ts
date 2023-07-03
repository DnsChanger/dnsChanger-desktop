import { access, constants as fileConstant } from "fs/promises";
import { Server } from "../../shared/interfaces/server.interface";
import { join } from "node:path";

export async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fileConstant.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getOverlayIcon(server: Server): Promise<string> {
  // let filepath = join(process.env.PUBLIC, `servers-icon/${server.avatar}`);
  // const isValidate =
  //   server.avatar != "def.png" ? await checkFileExists(filepath) : false;
  // if (!isValidate) {
  //   filepath = join(process.env.PUBLIC, `icons/icon-connected.png`);
  // }
  return getPublicFilePath(`icons/icon-connected.png`);
}

export function getPublicFilePath(filePath: string): string {
  return join(process.env.PUBLIC, filePath);
}
