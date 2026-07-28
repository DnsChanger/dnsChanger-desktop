import { isIPv4 } from 'node:net'
import type { DnsProtocol, Server } from '../interfaces/server.interface'
import { getServerProtocol } from '../interfaces/server.interface'

export function isValidDnsAddress(value: string) {
	return isIPv4(value)
}

export function isValidDohUrl(value: string): boolean {
	if (!value || typeof value !== 'string') return false
	try {
		const url = new URL(value.trim())
		return url.protocol === 'https:' && Boolean(url.hostname)
	} catch {
		return false
	}
}

/** Hostname or host:port for DNS-over-TLS (default port 853). */
export function isValidDotHost(value: string): boolean {
	if (!value || typeof value !== 'string') return false
	const trimmed = value.trim()
	if (trimmed.includes('://') || /\s/.test(trimmed)) return false

	const [host, portPart] = trimmed.split(':')
	if (!host || host.length > 253) return false
	if (portPart !== undefined) {
		const port = Number(portPart)
		if (!Number.isInteger(port) || port < 1 || port > 65535) return false
	}

	// Allow IPv4 or domain labels
	if (isIPv4(host)) return true
	return /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*$/.test(
		host
	)
}

export function validateServerAddresses(server: Partial<Server>): string | null {
	const protocol: DnsProtocol = getServerProtocol(server as Server)

	if (protocol === 'doh') {
		if (!server.dohUrl || !isValidDohUrl(server.dohUrl)) {
			return 'A valid DoH URL (https://...) is required'
		}
		if (server.servers?.[0] && !isValidDnsAddress(server.servers[0])) {
			return 'Bootstrap DNS IP is not valid'
		}
		if (server.servers?.[1] && !isValidDnsAddress(server.servers[1])) {
			return 'Alternate bootstrap DNS IP is not valid'
		}
		return null
	}

	if (protocol === 'dot') {
		if (!server.dotHost || !isValidDotHost(server.dotHost)) {
			return 'A valid DoT hostname is required'
		}
		if (server.servers?.[0] && !isValidDnsAddress(server.servers[0])) {
			return 'Bootstrap DNS IP is not valid'
		}
		if (server.servers?.[1] && !isValidDnsAddress(server.servers[1])) {
			return 'Alternate bootstrap DNS IP is not valid'
		}
		return null
	}

	if (!server.servers?.[0] || !isValidDnsAddress(server.servers[0])) {
		return 'DNS1 is required'
	}
	if (server.servers?.[1] && !isValidDnsAddress(server.servers[1])) {
		return 'DNS2 is not valid'
	}
	if (
		server.servers?.[1] &&
		server.servers[0].toString() === server.servers[1].toString()
	) {
		return 'DNS 1 and DNS 2 values must not be duplicates.'
	}
	return null
}
