export type ActiveEncryptedConnection = {
	key: string
	protocol: 'doh' | 'dot'
	mode: 'native' | 'proxy'
	dohUrl?: string
	dotHost?: string
	bootstrap: string[]
}
