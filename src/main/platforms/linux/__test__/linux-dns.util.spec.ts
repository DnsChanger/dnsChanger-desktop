import { parseIpv4DnsList, pickPreferredConnection, shellQuote } from '../linux-dns.util'

describe('linux-dns.util', () => {
	describe('shellQuote', () => {
		it('wraps plain values in single quotes', () => {
			expect(shellQuote('eth0')).toBe("'eth0'")
		})

		it('escapes embedded single quotes', () => {
			expect(shellQuote("Wired connection's 1")).toBe("'Wired connection'\\''s 1'")
		})
	})

	describe('parseIpv4DnsList', () => {
		it('extracts unique IPv4 addresses', () => {
			expect(
				parseIpv4DnsList(
					'nameserver 1.1.1.1\nnameserver 8.8.8.8\nnameserver 1.1.1.1'
				)
			).toEqual(['1.1.1.1', '8.8.8.8'])
		})

		it('ignores invalid octets', () => {
			expect(parseIpv4DnsList('999.1.1.1 1.2.3.4')).toEqual(['1.2.3.4'])
		})
	})

	describe('pickPreferredConnection', () => {
		it('prefers ethernet/wifi over vpn', () => {
			const picked = pickPreferredConnection([
				{ name: 'vpn', device: 'tun0', type: 'vpn' },
				{ name: 'Home', device: 'wlan0', type: '802-11-wireless' },
			])
			expect(picked?.device).toBe('wlan0')
		})

		it('returns null for empty list', () => {
			expect(pickPreferredConnection([])).toBeNull()
		})
	})
})
