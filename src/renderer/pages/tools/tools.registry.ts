import type { IconType } from 'react-icons'
import { BsGlobe, BsPower } from 'react-icons/bs'
import { MdSwapHoriz } from 'react-icons/md'
import { MyIpTool } from './my-ip.tool'
import { ShutdownTool } from './shutdown.tool'
import { NetworkSwitchTool } from './network-switch.tool'

export interface ToolDefinition {
	key: string
	name: string
	description: string
	icon: IconType
	iconColor: string
	component: () => React.JSX.Element
}

export const tools: ToolDefinition[] = [
	{
		key: 'network-switch',
		name: 'LAN / Wi-Fi Switcher',
		description: 'Switch between LAN (Ethernet) and Wi-Fi adapters in the OS',
		icon: MdSwapHoriz,
		iconColor: 'text-secondary',
		component: NetworkSwitchTool,
	},
	{
		key: 'my-ip',
		name: 'My IP',
		description: 'View public IP address, location, and ISP details',
		icon: BsGlobe,
		iconColor: 'text-primary',
		component: MyIpTool,
	},
	{
		key: 'shutdown',
		name: 'Shutdown',
		description: 'Schedule automatic system shutdown',
		icon: BsPower,
		iconColor: 'text-error',
		component: ShutdownTool,
	},
]
