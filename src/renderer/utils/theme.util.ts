export async function themeChanger(
	theme: 'dark' | 'light' | 'system',
): Promise<void> {
	const res = await window.ui.toggleTheme(theme)
	const newTheme = res ? 'dark' : 'light'

	const doc = document.querySelector('html')
	for (const c of doc.classList) {
		doc.classList.remove(c)
	}
	document.querySelector('html').classList.add(newTheme)
}

type returnTheme = 'dark' | 'light'

export function getThemeSystem(): returnTheme {
	if (
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) {
		return 'dark'
	}

	return 'light'
}
