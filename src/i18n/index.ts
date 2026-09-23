import type { Translation } from '../i18n-types'

const it: Translation = {
	pages: {
		home: {
			homeTitle: 'DNS Changer',
			connectedHTML: 'Connesso a <u>{currentActive}</u>',
			connected: 'Connesso a {currentActive}',
			disconnected: 'Disconnesso',
			unknownServer: 'connesso a un server sconosciuto.',
		},
		settings: {
			title: 'Impostazioni',
			autoRunningTitle:
				'Esecuzione automatica del programma all'avvio del sistema',
			langChanger: 'Cambia lingua',
			themeChanger: 'Tema',
		},
		addCustomDns: {
			NameOfServer: 'Nome server',
			serverAddr: 'Indirizzo server',
		},
	},
	themeChanger: {
		dark: 'Scuro',
		light: 'Chiaro',
	},
	buttons: {
		update: 'Aggiorna l'elenco',
		favDnsServer: 'Aggiunta di un server (DNS) personalizzato',
		add: 'Aggiungi',
		flushDns: 'Reset DNS',
		ping: 'Ping',
	},
	waiting: 'Attendere prego...',
	disconnecting: 'disconnessione...',
	connecting: 'connessione...',
	successful: 'riuscita',
	help_connect: 'Clicca per connetterti',
	help_disconnect: 'Clicca per disconnetterti',
	dialogs: {
		fetching_data_from_repo: 'recupero dati dal repository...',
		removed_server: '{serverName} è stato rimosso con successo dall'elenco.',
		added_server: 'Il server {serverName} è stato aggiunto con successo.',
		flush_successful: 'Pulizia completata con successo.',
		flush_failure: 'Pulizia fallita.',
	},
	errors: {
		error_fetching_data: 'Errore nella ricezione dei dati dal {target}',
	},
	validator: {
		invalid_dns1: 'Il valore DNS 1 non è valido.',
		invalid_dns2: 'Il valore DNS 2 non è valido.',
		dns1_dns2_duplicates: 'I valori DNS 1 e DNS 2 non devono essere duplicati.',
	},
	version: 'versione',
}

export default it
