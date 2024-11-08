import React, { useEffect, useState } from 'react'

import { useI18nContext } from '../../i18n/i18n-react'
import { Option, Select, Switch, Typography } from '@material-tailwind/react'
import { getThemeSystem, themeChanger } from '../utils/theme.util'
import { CgDarkMode } from 'react-icons/cg'
import { HiMoon, HiSun } from 'react-icons/hi'
import { SettingInStore } from '../../shared/interfaces/settings.interface'
import { MdBrowserUpdated } from 'react-icons/md'
import { VscRunAbove } from 'react-icons/vsc'
import { TbWindowMinimize } from 'react-icons/tb'
import { Button } from 'react-daisyui'
import { FaFileAlt, FaLaptop } from 'react-icons/fa'

export function SettingPage() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	useEffect(() => {
		window.ipc.saveSettings(settingState).catch()
	}, [settingState])

	return (
		<div
			className="hero flex flex-col justify-center items-center p-5"
			dir={locale === 'fa' ? 'rtl' : 'ltr'}
		>
			<div className="flex flex-col items-start gap-4 ">
				<div className="dark:bg-[#262626] bg-base-200 p-4 rounded-lg shadow w-[600px] h-[300px]">
					<div className="flex flex-col  overflow-auto h-[100%]  px-2">
						<div className="flex flex-col  mt-2">
							<ThemeChanger />
						</div>
						<div className="flex flex-col gap-1 mt-5">
							<div>
								<Switch
									id={'startUp'}
									crossOrigin={'anonymous'}
									color={'green'}
									label={
										<div>
											<Typography
												variant={'small'}
												color="blue-gray"
												className="font-medium dark:text-gray-400 font-[Inter] flex flex-row items-center gap-2"
											>
												<VscRunAbove />
												Start up
											</Typography>
											<Typography
												variant="paragraph"
												color="gray"
												className="font-normal  dark:text-gray-600 font-[Inter] text-[12px] "
											>
												{LL.pages.settings.autoRunningTitle()}
											</Typography>
										</div>
									}
									containerProps={{
										className: '-mt-5 mr-2',
									}}
									onChange={toggleStartUp}
									defaultChecked={settingState.startUp}
								/>
							</div>
							<div>
								<Switch
									id={'autoUP'}
									crossOrigin={'anonymous'}
									color={'green'}
									label={
										<div>
											<Typography
												variant={'small'}
												color="blue-gray"
												className="font-medium dark:text-gray-400 font-[Inter] flex flex-row items-center gap-2"
											>
												<MdBrowserUpdated />
												Automatic Update
											</Typography>
											<Typography
												variant="paragraph"
												color="gray"
												className="font-normal  dark:text-gray-600 font-[Inter] text-[12px] "
											>
												Get updates automatically
											</Typography>
										</div>
									}
									containerProps={{
										className: '-mt-5 mr-2',
									}}
									onChange={toggleAutoUpdate}
									defaultChecked={settingState.autoUpdate}
								/>
							</div>
							<div>
								<Switch
									id={'Minimize'}
									crossOrigin={'anonymous'}
									color={'green'}
									label={
										<div>
											<Typography
												variant={'small'}
												color="blue-gray"
												className="font-medium  dark:text-gray-400 font-[Inter] flex flex-row items-center gap-2"
											>
												<TbWindowMinimize />
												Minimize to Tray
											</Typography>
											<Typography
												variant="paragraph"
												color="gray"
												className="font-medium  dark:text-gray-600 font-[Inter] text-[12px]"
											>
												The app move to try in background
											</Typography>
										</div>
									}
									containerProps={{
										className: '-mt-5 mr-2',
									}}
									onChange={toggleMinimize_tray}
									defaultChecked={settingState.minimize_tray}
								/>
							</div>
						</div>
						<div className="flex gap-2 mt-5">
							<Button
								onClick={() => window.ipc.openLogFile()}
								size={'sm'}
								color={'ghost'}
								variant={'outline'}
								className="font-[Inter] normal-case border-2 border-gray-400 dark:border-gray-600"
							>
								<FaFileAlt />
								Open Log
							</Button>
							<Button
								onClick={() => window.ipc.openDevTools()}
								size={'sm'}
								color={'ghost'}
								variant={'outline'}
								className="font-[Inter] normal-case border-2 border-gray-400 dark:border-gray-600"
							>
								<FaLaptop />
								Open Dev Tools
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const ThemeChanger = () => {
	const [currentTheme, setCurrentTheme] = useState(
		localStorage.getItem('theme') || getThemeSystem(),
	)
	const { LL } = useI18nContext()

	useEffect(() => {
		themeChanger(currentTheme as any)
		localStorage.setItem('theme', currentTheme)
	}, [currentTheme])

	return (
		<div className="select-material">
			<Select
				label={LL.pages.settings.themeChanger()}
				animate={{
					mount: { y: 0 },
					unmount: { y: 25 },
				}}
				value={currentTheme}
				color="indigo"
				selected={(element) =>
					element &&
					React.cloneElement(element, {
						className: 'flex items-center px-0 gap-2 pointer-events-none',
					})
				}
				onChange={(value) => setCurrentTheme(value)}
				className={'dark:bg-[#262626] bg-base-200 text-[#6B6A6A] font-[Inter]'}
			>
				<Option value="system" className="flex items-center gap-2 font-[Inter]">
					<CgDarkMode />
					System
				</Option>
				<Option value="dark" className="flex items-center gap-2 font-[Inter]">
					<HiMoon />
					{LL.themeChanger.dark()}
				</Option>
				<Option value="light" className="flex items-center gap-2 font-[Inter]">
					<HiSun />
					{LL.themeChanger.light()}
				</Option>
			</Select>
		</div>
	)
}
