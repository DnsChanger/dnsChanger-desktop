import type { Locales } from '../../i18n/i18n-types'
import type { ActiveEncryptedConnection } from './encrypted-dns.interface'
import type { ServerStore } from './server.interface'

export interface Settings {
	startUp: boolean
	lng: Locales
	autoUpdate: boolean
	minimize_tray: boolean
	network_interface: string | 'Auto'
	use_analytic: boolean
}

export type SettingInStore = Settings

export type StoreKey = {
	dnsList: ServerStore[]
	settings: SettingInStore
	defaultServer: ServerStore | null
	activeEncryptedConnection: ActiveEncryptedConnection | null
}
