import type { IconType } from 'react-icons'
import { BsGlobe, BsPower } from 'react-icons/bs'
import { MdSwapHoriz } from 'react-icons/md'
import { MyIpTool } from './my-ip.tool'
import { ShutdownTool } from './shutdown.tool'
import { NetworkSwitchTool } from './network-switch.tool'

export type SupportedPlatform = NodeJS.Platform | 'win32' | 'linux' | 'darwin'

export interface ToolDefinition {
	key: string
	name: string
	description: string
	icon: IconType
	iconColor: string
	platforms: SupportedPlatform[]
	component: () => React.JSX.Element
}

export const tools: ToolDefinition[] = [
	{
		key: 'network-switch',
		name: 'LAN / Wi-Fi Switcher',
		description: 'Switch between LAN (Ethernet) and Wi-Fi adapters in the OS',
		icon: MdSwapHoriz,
		iconColor: 'text-secondary',
		platforms: ['win32'],
		component: NetworkSwitchTool,
	},
	{
		key: 'my-ip',
		name: 'My IP',
		description: 'View public IP address, location, and ISP details',
		icon: BsGlobe,
		iconColor: 'text-primary',
		platforms: ['win32', 'linux', 'darwin'],
		component: MyIpTool,
	},
	{
		key: 'shutdown',
		name: 'Shutdown',
		description: 'Schedule automatic system shutdown',
		icon: BsPower,
		iconColor: 'text-error',
		platforms: ['win32', 'linux', 'darwin'],
		component: ShutdownTool,
	},
]
