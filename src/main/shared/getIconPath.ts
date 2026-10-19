import * as path from 'node:path'

export function getIconPath(): string {
  const publicDir = process.env.PUBLIC || ''
  let icon: string
  switch (process.platform) {
    case 'win32':
      icon = path.join(publicDir, 'icons/icon.ico')
      break
    case 'darwin':
      icon = path.join(publicDir, 'icons/icon.ico')
      break
    case 'linux':
      icon = path.join(publicDir, 'icons/icon.png')
      break
    default:
      icon = path.join(publicDir, 'icons/icon.ico')
      break
  }
  return icon
}
