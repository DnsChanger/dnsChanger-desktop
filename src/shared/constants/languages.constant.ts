export interface Language {
	name: string
	value: string
	rtl?: boolean
}

export const languages: Array<Language> = [
	{ name: 'فارسی', value: 'fa', rtl: true },
	{ name: 'English', value: 'eng' },
	{ name: 'Русский', value: 'ru' },
	{ name: 'Italiano', value: 'it' },
	{ name: '日本語', value: 'ja' },
	{ name: 'العربية', value: 'ar', rtl: true },
	{ name: '中文', value: 'zh' },
	{ name: '한국어', value: 'ko' },
]

export const RTL_LOCALES = new Set(
	languages.filter((l) => l.rtl).map((l) => l.value),
)

export function isRtlLocale(locale: string): boolean {
	return RTL_LOCALES.has(locale)
}
