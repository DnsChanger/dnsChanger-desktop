import {
	isValidDnsAddress,
	isValidDohUrl,
	isValidDotHost,
	validateServerAddresses,
} from '../dns.validator'

describe('dns.validator', () => {
	describe('isValidDnsAddress', () => {
		it('accepts IPv4', () => {
			expect(isValidDnsAddress('1.1.1.1')).toBe(true)
		})

		it('rejects non-IPv4', () => {
			expect(isValidDnsAddress('cloudflare-dns.com')).toBe(false)
		})
	})

	describe('isValidDohUrl', () => {
		it('accepts https DoH endpoints', () => {
			expect(isValidDohUrl('https://cloudflare-dns.com/dns-query')).toBe(true)
			expect(isValidDohUrl('https://dns.example/dns-query?foo=1')).toBe(true)
		})

		it('rejects non-https', () => {
			expect(isValidDohUrl('http://example.com/dns-query')).toBe(false)
			expect(isValidDohUrl('cloudflare-dns.com')).toBe(false)
		})
	})

	describe('isValidDotHost', () => {
		it('accepts host and host:port', () => {
			expect(isValidDotHost('cloudflare-dns.com')).toBe(true)
			expect(isValidDotHost('dns.example.com:853')).toBe(true)
			expect(isValidDotHost('1.1.1.1')).toBe(true)
		})

		it('rejects urls and bad ports', () => {
			expect(isValidDotHost('tls://cloudflare-dns.com')).toBe(false)
			expect(isValidDotHost('dns.example.com:99999')).toBe(false)
		})
	})

	describe('validateServerAddresses', () => {
		it('validates plain dns pairs', () => {
			expect(
				validateServerAddresses({
					protocol: 'plain',
					servers: ['1.1.1.1', '1.0.0.1'],
				}),
			).toBeNull()
			expect(
				validateServerAddresses({
					protocol: 'plain',
					servers: ['1.1.1.1', '1.1.1.1'],
				}),
			).toContain('duplicates')
		})

		it('validates doh servers', () => {
			expect(
				validateServerAddresses({
					protocol: 'doh',
					dohUrl: 'https://dns.google/dns-query',
					servers: [],
				}),
			).toBeNull()
			expect(
				validateServerAddresses({
					protocol: 'doh',
					dohUrl: 'not-a-url',
					servers: [],
				}),
			).toContain('DoH URL')
		})

		it('validates dot servers', () => {
			expect(
				validateServerAddresses({
					protocol: 'dot',
					dotHost: 'dns.quad9.net',
					servers: ['9.9.9.9'],
				}),
			).toBeNull()
			expect(
				validateServerAddresses({
					protocol: 'dot',
					dotHost: '',
					servers: ['9.9.9.9'],
				}),
			).toContain('DoT hostname')
		})
	})
})
