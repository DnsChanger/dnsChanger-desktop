import React, { useEffect, useState } from 'react'
import { CgDarkMode } from 'react-icons/cg'
import { FaChartBar, FaFileAlt, FaLaptop } from 'react-icons/fa'
import { HiMoon, HiSun } from 'react-icons/hi'
import { MdBrowserUpdated, MdLanguage } from 'react-icons/md'
import { TbWindowMinimize } from 'react-icons/tb'
import { VscRunAbove } from 'react-icons/vsc'
import { useI18nContext } from '../../i18n/i18n-react'
import type { Locales } from '../../i18n/i18n-types'
import { languages } from '../../shared/constants/languages.constant'
import { isRtlLocale } from '../../shared/constants/languages.constant'
import type { SettingInStore } from '../../shared/interfaces/settings.interface'
import { settingStore } from '../app'
import { ItemSelector } from '../component/item-selector/item-selector'
import { ToggleSwitch } from '../component/toggle/toggle-switch.component'
import { syncAnalyticsPreference } from '../utils/analytics.util'
import { getThemeSystem, themeChanger } from '../utils/theme.util'

export function SettingPage() {
	const [_, setStartUp] = useState<boolean>(false)
	const { LL, locale } = useI18nContext()
	const [settingState, setSettingState] = useState<SettingInStore>(
		window.storePreload.get('settings'),
	)

	function toggleStartUp() {
		window.ipc.toggleStartUP().then((res) => setStartUp(res))
	}

	function toggleAutoUpdate() {
		setSettingState((prevState) => ({
			...prevState,
			autoUpdate: !prevState.autoUpdate,
		}))
	}

	function toggleMinimize_tray() {
		setSettingState((prevState) => ({
			...prevState,
			minimize_tray: !prevState.minimize_tray,
		}))
	}

	function toggleAnalytics() {
		setSettingState((prevState) => {
			const next = !prevState.use_analytic
			syncAnalyticsPreference(next)
			return {
				...prevState,
				use_analytic: next,
			}
		})
	}

	useEffect(() => {
		settingStore.lng = settingState.lng
		settingStore.use_analytic = settingState.use_analytic
		window.ipc.saveSettings(settingState).catch()
	}, [settingState])

	return (
		<div
			className="p-2 overflow-y-auto"
			dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}
		>
			<div className="max-w-2xl mx-auto">
				<div className="border shadow-lg bg-base-100 rounded-xl border-base-300">
					<div className="p-4 space-y-4">
						<ThemeChanger />

						<div className="border-t border-base-300" />

						<LanguageChanger
							value={settingState.lng}
							onChange={(lng) => {
								setSettingState((prev) => ({ ...prev, lng }))
								window.dispatchEvent(
									new CustomEvent('locale-change', { detail: lng }),
								)
							}}
							label={LL.pages.settings.langChanger()}
						/>

						<div className="border-t border-base-300" />

						<div className="space-y-3">
							<SettingsSwitch
								id="startUp"
								checked={settingState.startUp}
								onChange={toggleStartUp}
								icon={<VscRunAbove className="text-primary" />}
								title="Start up"
								description={LL.pages.settings.autoRunningTitle()}
							/>

							<SettingsSwitch
								id="autoUP"
								checked={settingState.autoUpdate}
								onChange={toggleAutoUpdate}
								icon={<MdBrowserUpdated className="text-success" />}
								title="Automatic Update"
								description="Get updates automatically"
							/>

							<SettingsSwitch
								id="Minimize"
								checked={settingState.minimize_tray}
								onChange={toggleMinimize_tray}
								icon={<TbWindowMinimize className="text-secondary" />}
								title="Minimize to Tray"
								description="The app moves to tray in background"
							/>

							<SettingsSwitch
								id="analytics"
								checked={settingState.use_analytic}
								onChange={toggleAnalytics}
								icon={<FaChartBar className="text-info" />}
								title="Analytics"
								description="Share anonymous usage counts (users & servers only)"
							/>
						</div>

						<div className="border-t border-base-300" />

						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => window.ipc.openLogFile()}
								className="btn btn-ghost btn-sm rounded-xl"
							>
								<FaFileAlt size={14} />
								Open Log
							</button>
							<button
								onClick={() => window.ipc.openDevTools()}
								className="btn btn-ghost btn-sm rounded-xl"
							>
								<FaLaptop size={14} />
								Open Dev Tools
							</button>
						</div>
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
	const [isChecked, setIsChecked] = useState(checked)

	useEffect(() => {
		setIsChecked(checked)
	}, [checked])

	const handleToggle = () => {
		setIsChecked(!isChecked)
		onChange()
	}

	return (
		<div className="flex items-start gap-3 p-1 transition-colors rounded-lg">
			<div className="flex items-center flex-1 min-w-0 gap-2">
				<span className="text-base-content/70">{icon}</span>
				<div className="flex-1 min-w-0">
					<label
						htmlFor={id}
						className="text-sm font-medium cursor-pointer text-base-content"
						onClick={handleToggle}
					>
						{title}
					</label>
					<p className="text-xs text-base-content/60 mt-0.5">{description}</p>
				</div>
				<ToggleSwitch enabled={isChecked} onToggle={handleToggle} />
			</div>
		</div>
	)
}

function ThemeChanger() {
	const [currentTheme, setCurrentTheme] = useState(
		localStorage.getItem('theme') || getThemeSystem(),
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
		<div className="flex items-center justify-between">
			<label className="text-sm font-medium text-base-content">
				{LL.pages.settings.themeChanger()}
			</label>
			<div className="flex gap-2">
				{themeOptions.map((f) => (
					<ItemSelector
						isActive={currentTheme === f.value}
						label={f.label}
						onClick={() => setCurrentTheme(f.value)}
						key={f.value}
					/>
				))}
			</div>
		</div>
	)
}

function LanguageChanger({
	value,
	onChange,
	label,
}: {
	value: Locales
	onChange: (lng: Locales) => void
	label: string
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<MdLanguage className="text-primary" size={16} />
				<label className="text-sm font-medium text-base-content">{label}</label>
			</div>
			<div className="flex flex-wrap gap-2">
				{languages.map((lang) => (
					<ItemSelector
						key={lang.value}
						isActive={value === lang.value}
						label={lang.name}
						onClick={() => onChange(lang.value as Locales)}
					/>
				))}
			</div>
		</div>
	)
}
