export type DnsProtocol = 'plain' | 'doh' | 'dot'

export interface Server extends Record<string, any> {
	key: string
	name: string
	/** Bootstrap / plaintext nameserver IPs (also used by native DoH/DoT APIs). */
	servers: string[]
	avatar: string
	rate: number
	tags: string[]
	/** Defaults to plain when omitted (backward compatible with catalog). */
	protocol?: DnsProtocol
	/** DoH template, e.g. https://cloudflare-dns.com/dns-query */
	dohUrl?: string
	/** DoT hostname / SNI, e.g. cloudflare-dns.com or AdGuard host */
	dotHost?: string
}

export interface ServerStore extends Server {
	isPin: boolean
}

export function getServerProtocol(server: Pick<Server, 'protocol'>): DnsProtocol {
	return server.protocol || 'plain'
}

export function isEncryptedDns(server: Pick<Server, 'protocol'>): boolean {
	const protocol = getServerProtocol(server)
	return protocol === 'doh' || protocol === 'dot'
}
