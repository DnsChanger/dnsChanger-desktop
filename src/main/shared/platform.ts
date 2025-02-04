import os from 'node:os'

export function isWindows() {
	return os.platform() === 'win32'
}
