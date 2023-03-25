import type { BaseTranslation } from '../i18n-types'

const eng: BaseTranslation = {
	pages: {
		home: {
			hometitle: "DNS Changer",
			connected: 'Connected to <u>{currentActive}</u>',
			annonumos: "You are connected to an unknown server.",
		},
		settings: {
			title: "Settings",
			autorunningTitle: "Automatic execution of the program when the system is turned on"
		},
		addfavDnspage: {
			NameOfServer: "Server name",
			ipserivce: "Server address"
		}
	},
	buttons: {
		update: "Update the list",
		favDnsServer: "Adding a custom (DNS) server",
		add: "Add"
	},
	waiting: "Please wait...",
	dialogs: {
		fetching_data_from_repo: "fetching data from repository..."
	},
	errors: {
		error_fetchig_data: "Error in receiving data from the {target}"
	}
}

export default eng
