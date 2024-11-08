import electronStore from 'electron-store'

import { serversConstant } from '../../shared/constants/servers.cosntant'
import { StoreKey } from '../../shared/interfaces/settings.interface'
import { defaultSetting } from '../../shared/constants/default-setting.contant'

export const store = new electronStore<StoreKey>({
	defaults: {
		dnsList: serversConstant,
		settings: defaultSetting,
		defaultServer: null,
	},
	name: 'dnsChangerStore_1.9.0',
})
