import React, { useState } from 'react'

import { useI18nContext } from '../../i18n/i18n-react'
import { NavbarComponent } from '../component/head/navbar.component'

interface Props {
	children: JSX.Element
}

export function PageWrapper(prop: Props) {
	const [currentPage] = useState('/')
	const { LL, locale } = useI18nContext()
	return (
		<div dir={locale == 'fa' ? 'rtl' : 'ltr'}>
			<NavbarComponent />
			{React.cloneElement(prop.children, { currentPage })}
		</div>
	)
}
