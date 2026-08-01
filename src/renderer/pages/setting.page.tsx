import type React from 'react'
import { useEffect, useState } from 'react'
import { useI18nContext } from '../../i18n/i18n-react'
import { getThemeSystem, themeChanger } from '../utils/theme.util'
import type { SettingInStore } from '../../shared/interfaces/settings.interface'
import { ToggleSwitch } from '../component/toggle/toggle-switch.component'
import { ItemSelector } from '../component/item-selector/item-selector'
import { CgDarkMode } from 'react-icons/cg'
import { HiMoon, HiSun } from 'react-icons/hi'
import { MdBrowserUpdated, MdOutlineAnalytics } from 'react-icons/md'
import { VscRunAbove } from 'react-icons/vsc'
import {
	TbWindowMinimize,
	TbNetwork,
	TbPalette,
	TbSettings,
	TbTerminal2,
} from 'react-icons/tb'
import { FaFileAlt, FaLaptop } from 'react-icons/fa'

interface NetworkInterfaceItem {
	name: string
	type: string
	ip_address?: string
}

export function SettingPage() {
	const { LL } = useI18nContext()
	const [settingState, setSettingState] = useState<SettingInStore>(
		window.storePreload.get('settings')
	)
	const [interfaces, setInterfaces] = useState<NetworkInterfaceItem[]>([])

	useEffect(() => {
		window.os
			.getInterfaces()
			.then((list: NetworkInterfaceItem[]) => {
				if (Array.isArray(list)) {
					setInterfaces(list)
				}
			})
			.catch(() => {})
	}, [])

	function toggleStartUp() {
		window.ipc.toggleStartUP().then((res: boolean) => {
			setSettingState((prevState: SettingInStore) => ({
				...prevState,
				startUp: res !== undefined ? res : !prevState.startUp,
			}))
		})
	}

	function toggleAutoUpdate() {
		setSettingState((prevState: SettingInStore) => ({
			...prevState,
			autoUpdate: !prevState.autoUpdate,
		}))
	}

	function toggleMinimize_tray() {
		setSettingState((prevState: SettingInStore) => ({
			...prevState,
			minimize_tray: !prevState.minimize_tray,
		}))
	}

	function toggleUseAnalytic() {
		setSettingState((prevState: SettingInStore) => ({
			...prevState,
			use_analytic: !prevState.use_analytic,
		}))
	}

	function handleNetworkInterfaceChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const val = e.target.value
		setSettingState((prevState: SettingInStore) => ({
			...prevState,
			network_interface: val,
		}))
	}

	useEffect(() => {
		window.ipc.saveSettings(settingState).catch(() => {})
	}, [settingState])

	return (
		<div className="w-full h-full overflow-y-auto p-3 bg-base-300">
			<div className="max-w-2xl mx-auto space-y-4 pb-20">
				{/* Appearance */}
				<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
					<div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
						<TbPalette className="text-primary text-lg" />
						<h3 className="font-semibold text-sm text-base-content">
							Appearance
						</h3>
					</div>
					<div className="p-4">
						<ThemeChanger />
					</div>
				</div>

				{/* Application Preferences */}
				<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
					<div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
						<TbSettings className="text-primary text-lg" />
						<h3 className="font-semibold text-sm text-base-content">
							Preferences
						</h3>
					</div>
					<div className="p-2 space-y-1">
						{/* Start Up */}
						<SettingsSwitch
							id="startUp"
							checked={settingState.startUp}
							onChange={toggleStartUp}
							icon={<VscRunAbove />}
							title="Start up"
							description={LL.pages.settings.autoRunningTitle()}
						/>

						{/* Auto Update */}
						<SettingsSwitch
							id="autoUP"
							checked={settingState.autoUpdate}
							onChange={toggleAutoUpdate}
							icon={<MdBrowserUpdated />}
							title="Automatic Update"
							description="Get updates automatically"
						/>

						{/* Minimize to Tray */}
						<SettingsSwitch
							id="Minimize"
							checked={settingState.minimize_tray}
							onChange={toggleMinimize_tray}
							icon={<TbWindowMinimize />}
							title="Minimize to Tray"
							description="The app moves to tray in background"
						/>

						{/* Analytics */}
						<SettingsSwitch
							id="Analytics"
							checked={settingState.use_analytic ?? true}
							onChange={toggleUseAnalytic}
							icon={<MdOutlineAnalytics />}
							title="Anonymous Analytics"
							description="Help improve the application with anonymous usage data"
						/>
					</div>
				</div>

				{/* Network Configuration */}
				<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
					<div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
						<TbNetwork className="text-primary text-lg" />
						<h3 className="font-semibold text-sm text-base-content">
							Network Settings
						</h3>
					</div>
					<div className="p-4 space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
							<div>
								<label
									htmlFor="network-interface-select"
									className="text-sm font-medium text-base-content block"
								>
									Network Interface
								</label>
								<p className="text-xs text-base-content/60 mt-0.5">
									Select adapter to apply DNS settings (Auto detects
									active adapter)
								</p>
							</div>
							<select
								id="network-interface-select"
								value={settingState.network_interface || 'Auto'}
								onChange={handleNetworkInterfaceChange}
								className="select select-bordered select-sm rounded-xl max-w-xs bg-base-200 text-base-content"
							>
								<option value="Auto">✨ Auto (Detect Active)</option>
								{interfaces.map((inter) => (
									<option key={inter.name} value={inter.name}>
										{inter.name} {inter.type ? `(${inter.type})` : ''}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Diagnostics & Developer */}
				<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
					<div className="px-4 py-3 bg-base-200 border-b border-base-300 flex items-center gap-2">
						<TbTerminal2 className="text-primary text-lg" />
						<h3 className="font-semibold text-sm text-base-content">
							Diagnostics & Tools
						</h3>
					</div>
					<div className="p-4 flex flex-wrap gap-2.5 items-center justify-between sm:justify-start">
						<button
							onClick={() => window.ipc.openLogFile()}
							className="btn btn-ghost btn-sm rounded-xl gap-2 text-base-content/80 hover:text-base-content font-normal"
						>
							<FaFileAlt size={14} />
							Open Log
						</button>
						<button
							onClick={() => window.ipc.openDevTools()}
							className="btn btn-ghost btn-sm rounded-xl gap-2 text-base-content/80 hover:text-base-content font-normal"
						>
							<FaLaptop size={14} />
							Open Dev Tools
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

interface SettingsSwitchProps {
	id: string
	checked: boolean
	onChange: () => void
	icon: React.ReactNode
	title: string
	description: string
}

function SettingsSwitch({
	id,
	checked,
	onChange,
	icon,
	title,
	description,
}: SettingsSwitchProps) {
	return (
		<div
			className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-base-200 transition-colors cursor-pointer"
			onClick={onChange}
		>
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<span className="p-2 rounded-xl bg-base-200 text-base-content/70 flex items-center justify-center shrink-0">
					{icon}
				</span>
				<div className="flex-1 min-w-0">
					<label
						htmlFor={id}
						className="text-sm font-medium cursor-pointer text-base-content block"
						onClick={(e) => e.stopPropagation()}
					>
						{title}
					</label>
					<p className="text-xs text-base-content/60 mt-0.5 leading-tight">
						{description}
					</p>
				</div>
			</div>
			<div onClick={(e) => e.stopPropagation()} className="shrink-0">
				<ToggleSwitch enabled={checked} onToggle={onChange} />
			</div>
		</div>
	)
}

function ThemeChanger() {
	const [currentTheme, setCurrentTheme] = useState(
		localStorage.getItem('theme') || getThemeSystem()
	)
	const { LL } = useI18nContext()

	const themeOptions = [
		{ value: 'system', label: 'System', icon: <CgDarkMode size={16} /> },
		{ value: 'dark', label: LL.themeChanger.dark(), icon: <HiMoon size={16} /> },
		{ value: 'light', label: LL.themeChanger.light(), icon: <HiSun size={16} /> },
	]

	useEffect(() => {
		themeChanger(currentTheme as any)
		localStorage.setItem('theme', currentTheme)
	}, [currentTheme])

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				<label className="text-sm font-medium text-base-content block">
					{LL.pages.settings.themeChanger()}
				</label>
				<p className="text-xs text-base-content/60 mt-0.5">
					Choose app appearance theme
				</p>
			</div>
			<div className="flex gap-2">
				{themeOptions.map((f) => (
					<ItemSelector
						isActive={currentTheme === f.value}
						label={
							<span className="flex items-center gap-1.5">
								{f.icon}
								<span>{f.label}</span>
							</span>
						}
						onClick={() => setCurrentTheme(f.value)}
						key={f.value}
					/>
				))}
			</div>
		</div>
	)
}
