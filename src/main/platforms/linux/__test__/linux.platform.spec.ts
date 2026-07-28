jest.mock('../../../store/store', () => ({
	store: {
		get: jest.fn(() => ({ network_interface: 'Auto' })),
	},
}))

jest.mock('../linux-dns.util', () => {
	const actual = jest.requireActual('../linux-dns.util')
	return {
		...actual,
		detectLinuxDnsBackend: jest.fn(),
		listNmConnections: jest.fn(),
		listNmDevices: jest.fn(),
		listIpDevices: jest.fn(),
		getDefaultRouteInterface: jest.fn(),
		commandExists: jest.fn(),
		runUserCmd: jest.fn(),
	}
})

import { store } from '../../../store/store'
import { LinuxPlatform } from '../linux.platform'
import * as linuxDnsUtil from '../linux-dns.util'

describe('LinuxPlatform', () => {
	let platform: LinuxPlatform

	beforeEach(() => {
		jest.clearAllMocks()
		platform = new LinuxPlatform()
		;(store.get as jest.Mock).mockReturnValue({ network_interface: 'Auto' })
	})

	describe('setDns (NetworkManager)', () => {
		it('sets ipv4.dns and ignores auto dns on the active connection', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'networkmanager'
			)
			;(linuxDnsUtil.listNmConnections as jest.Mock).mockResolvedValue([
				{ name: 'Wired connection 1', device: 'eth0', type: '802-3-ethernet' },
			])

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.setDns(['1.1.1.1', '8.8.8.8'])

			expect(execSpy).toHaveBeenCalledTimes(1)
			const cmd = execSpy.mock.calls[0][0] as string
			expect(cmd).toContain('nmcli con mod')
			expect(cmd).toContain('ipv4.dns')
			expect(cmd).toContain('1.1.1.1 8.8.8.8')
			expect(cmd).toContain('ipv4.ignore-auto-dns yes')
			expect(cmd).toContain('nmcli con up')
		})
	})

	describe('clearDns (NetworkManager)', () => {
		it('restores automatic DNS (DHCP) instead of hardcoding public resolvers', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'networkmanager'
			)
			;(linuxDnsUtil.listNmConnections as jest.Mock).mockResolvedValue([
				{ name: 'WiFi', device: 'wlan0', type: '802-11-wireless' },
			])

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.clearDns()

			const cmd = execSpy.mock.calls[0][0] as string
			expect(cmd).toContain('ipv4.ignore-auto-dns no')
			expect(cmd).not.toContain('8.8.8.8')
			expect(cmd).not.toContain('1.1.1.1')
		})
	})

	describe('setDns (systemd-resolved)', () => {
		it('uses resolvectl on the default interface', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'systemd-resolved'
			)
			;(linuxDnsUtil.getDefaultRouteInterface as jest.Mock).mockResolvedValue(
				'enp0s3'
			)

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.setDns(['9.9.9.9'])

			const cmd = execSpy.mock.calls[0][0] as string
			expect(cmd).toContain('resolvectl dns')
			expect(cmd).toContain('enp0s3')
			expect(cmd).toContain('9.9.9.9')
			expect(cmd).toContain('resolvectl domain')
		})
	})

	describe('clearDns (systemd-resolved)', () => {
		it('reverts the interface DNS configuration', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'systemd-resolved'
			)
			;(linuxDnsUtil.getDefaultRouteInterface as jest.Mock).mockResolvedValue(
				'enp0s3'
			)

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.clearDns()

			expect(execSpy.mock.calls[0][0]).toContain('resolvectl revert')
		})
	})

	describe('setDns (resolvconf fallback)', () => {
		it('backs up resolv.conf and writes nameservers without restarting networkd', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'resolvconf'
			)

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.setDns(['1.1.1.1', '1.0.0.1'])

			const cmd = execSpy.mock.calls[0][0] as string
			expect(cmd).toContain('resolv.conf.dnschanger.bak')
			expect(cmd).toContain('base64 -d')
			expect(cmd).not.toContain('systemd-networkd')
		})
	})

	describe('getActiveDns', () => {
		it('reads DNS from NetworkManager connection', async () => {
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'networkmanager'
			)
			;(linuxDnsUtil.listNmConnections as jest.Mock).mockResolvedValue([
				{ name: 'Wired', device: 'eth0', type: 'ethernet' },
			])
			;(linuxDnsUtil.runUserCmd as jest.Mock).mockResolvedValue(
				'IP4.DNS:1.1.1.1\nIP4.DNS:8.8.8.8\n'
			)

			await expect(platform.getActiveDns()).resolves.toEqual(['1.1.1.1', '8.8.8.8'])
		})
	})

	describe('getInterfacesList', () => {
		it('returns connected NetworkManager devices', async () => {
			;(linuxDnsUtil.listNmDevices as jest.Mock).mockResolvedValue([
				{
					device: 'wlan0',
					type: 'wifi',
					state: 'connected',
					connection: 'Home',
				},
				{
					device: 'eth0',
					type: 'ethernet',
					state: 'disconnected',
					connection: '',
				},
			])

			const list = await platform.getInterfacesList()
			expect(list).toHaveLength(1)
			expect(list[0].name).toBe('wlan0')
			expect(list[0].type).toBe('Wireless')
		})
	})

	describe('flushDns', () => {
		it('prefers resolvectl flush-caches', async () => {
			;(linuxDnsUtil.commandExists as jest.Mock).mockImplementation(
				async (bin: string) => bin === 'resolvectl'
			)

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.flushDns()

			expect(execSpy).toHaveBeenCalledWith('resolvectl flush-caches')
		})
	})

	describe('network interface setting', () => {
		it('uses the configured device when not Auto', async () => {
			;(store.get as jest.Mock).mockReturnValue({
				network_interface: 'wlan0',
			})
			;(linuxDnsUtil.detectLinuxDnsBackend as jest.Mock).mockResolvedValue(
				'networkmanager'
			)
			;(linuxDnsUtil.listNmConnections as jest.Mock).mockResolvedValue([
				{ name: 'Ethernet', device: 'eth0', type: 'ethernet' },
				{ name: 'WiFi', device: 'wlan0', type: 'wifi' },
			])

			const execSpy = jest
				.spyOn(LinuxPlatform.prototype as any, 'execCmd')
				.mockResolvedValue('')

			await platform.setDns(['8.8.8.8'])

			const cmd = execSpy.mock.calls[0][0] as string
			expect(cmd).toContain("'WiFi'")
		})
	})
})
