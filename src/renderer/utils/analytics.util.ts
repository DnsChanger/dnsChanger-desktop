import ReactGA from 'react-ga4'
import type { SettingInStore } from '../../shared/interfaces/settings.interface'

const GA_MEASUREMENT_ID = 'G-XJBQXCR24P'

let initialized = false

function readSettings(): SettingInStore | null {
	try {
		return window.storePreload.get('settings') as SettingInStore
	} catch {
		return null
	}
}

function analyticsEnabled(settings?: SettingInStore | null): boolean {
	const store = settings ?? readSettings()
	return Boolean(store?.use_analytic)
}

export function initAnalytics(settings?: SettingInStore): void {
	if (!analyticsEnabled(settings)) {
		initialized = false
		return
	}
	if (initialized) return
	ReactGA.initialize(GA_MEASUREMENT_ID)
	initialized = true
}

export function trackEvent(params: {
	category: string
	action: string
	label?: string
	value?: number
}): void {
	if (!analyticsEnabled() || !initialized) return
	ReactGA.event(params)
}

export function syncAnalyticsPreference(enabled: boolean): void {
	if (enabled) {
		initAnalytics({ ...(readSettings() || ({} as SettingInStore)), use_analytic: true })
	} else {
		initialized = false
	}
}
