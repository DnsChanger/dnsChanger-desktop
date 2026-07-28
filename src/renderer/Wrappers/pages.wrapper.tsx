import React, { type JSX, useState } from 'react'

import { useI18nContext } from '../../i18n/i18n-react'
import { isRtlLocale } from '../../shared/constants/languages.constant'

interface Props {
	children: JSX.Element
}

export function PageWrapper(prop: Props) {
	const [currentPage] = useState('/')
	const { locale } = useI18nContext()
	return (
		<div
			className="h-full bg-base-300"
			dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}
		>
			{React.cloneElement(prop.children, { currentPage })}
		</div>
	)
}
