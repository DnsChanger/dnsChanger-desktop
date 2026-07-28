import React, { useState, useEffect, type JSX } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import type { IconType } from 'react-icons'
import { BsPower } from 'react-icons/bs'
import { MdOutlineExplore } from 'react-icons/md'
import { TbSettings, TbSmartHome } from 'react-icons/tb'
import TypesafeI18n from '../i18n/i18n-react'
import type { Locales } from '../i18n/i18n-types'
import { loadLocaleAsync } from '../i18n/i18n-util.async'
import { isRtlLocale } from '../shared/constants/languages.constant'
import type {
	SettingInStore,
	Settings,
} from '../shared/interfaces/settings.interface'
import { PageWrapper } from './Wrappers/pages.wrapper'
import { NavbarComponent } from './component/head/navbar.component'
import { ExplorePage } from './pages/explore.page'
import { HomePage } from './pages/home.page'
import { SettingPage } from './pages/setting.page'
import { ShutdownPage } from './pages/shutdown.page'
import { initAnalytics } from './utils/analytics.util'
import { getThemeSystem, themeChanger } from './utils/theme.util'

export let settingStore: SettingInStore = window.storePreload.get('settings')

interface Page {
	key: string
	element: JSX.Element
	icon: IconType
	name: string
}

const pages: Page[] = [
	{ key: '/', element: <HomePage />, icon: TbSmartHome, name: 'Home' },
	{
		key: '/explore',
		element: <ExplorePage />,
		icon: MdOutlineExplore,
		name: 'Explore',
	},
	{ key: '/shutdown', element: <ShutdownPage />, icon: BsPower, name: 'Shutdown' },
	{ key: '/setting', element: <SettingPage />, icon: TbSettings, name: 'Setting' },
]
const queryClient = new QueryClient()

export function App() {
	const [wasLoaded, setWasLoaded] = useState(false)
	const [locale, setLocale] = useState<Locales>(
		(settingStore?.lng as Locales) || 'eng',
	)

	const [currentPage, setCurrentPage] = useState<Page>(pages[0])
	const [currentPath, setCurrentPath] = useState<string>('/')

	useEffect(() => {
		let page = pages.find((p) => p.key === currentPath)
		if (!page) page = pages[0]

		setCurrentPage(page)
	}, [currentPath])

	useEffect(() => {
		async function getSetting() {
			settingStore = (await window.ipc.getSettings()) as Settings
			initAnalytics(settingStore)
		}

		getSetting().then(() => {
			const nextLocale = (settingStore.lng as Locales) || 'eng'
			loadLocaleAsync(nextLocale).then(() => {
				setLocale(nextLocale)
				setWasLoaded(true)
			})
		})

		let theme = localStorage.getItem('theme') || 'dark'
		if (theme === 'system') theme = getThemeSystem()

		window
			.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', ({ matches }) => {
				if (theme === 'system') {
					if (matches) {
						themeChanger('dark')
					} else {
						themeChanger('light')
					}
				}
			})

		themeChanger(theme as any)

		async function onLocaleChange(event: Event) {
			const next = (event as CustomEvent<Locales>).detail
			if (!next) return
			await loadLocaleAsync(next)
			settingStore.lng = next
			setLocale(next)
		}

		window.addEventListener('locale-change', onLocaleChange as EventListener)
		return () => {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', () => {})
			window.removeEventListener(
				'locale-change',
				onLocaleChange as EventListener,
			)
		}
	}, [])

	if (!wasLoaded) return null
	function InPath(target: string): boolean {
		return currentPath === target
	}

	const dir = isRtlLocale(locale) ? 'rtl' : 'ltr'

	return (
		<div className="h-96">
			<TypesafeI18n locale={locale}>
				<NavbarComponent />
				<QueryClientProvider client={queryClient}>
					<PageWrapper>{currentPage.element}</PageWrapper>
				</QueryClientProvider>
				<div
					className="fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 px-4 bg-base-100"
					dir={dir}
				>
					{pages.map((page) => {
						return (
							<div
								key={page.key}
								onClick={() => setCurrentPath(page.key)}
								className="flex cursor-pointer"
							>
								<div
									className={`rounded-xl gap-1 p-2 transition-colors duration-200 flex items-center ${
										InPath(page.key)
											? 'bg-primary/10 text-primary'
											: 'hover:bg-primary/20 hover:text-primary/80 text-base-content/70'
									}`}
								>
									{React.createElement(page.icon, {
										size: 28,
									})}
									<AnimatePresence mode="wait">
										{InPath(page.key) && (
											<motion.span
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: 'auto' }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2 }}
												style={{
													overflow: 'hidden',
													whiteSpace: 'nowrap',
												}}
											>
												{page.name}
											</motion.span>
										)}
									</AnimatePresence>
								</div>
							</div>
						)
					})}
				</div>
				<Toaster />
			</TypesafeI18n>
		</div>
	)
}
