import { Notification, ipcMain, nativeImage } from 'electron'

import { getIconPath } from '../shared/getIconPath'
import { EventsKeys } from '../../shared/constants/eventsKeys.constant'

ipcMain.on(EventsKeys.NOTIFICATION, (_event, data) => {
	// new Notification({ title: "DNS Changer", body: data, icon }).show();
	notfi('DNS Changer', data)
})

export function notfi(title: string, message: string) {
	const icon = nativeImage.createFromPath(getIconPath())
	new Notification({ title, body: message, icon }).show()
}
