import { Alert } from '@material-tailwind/react'
import React, { useState, useEffect, ChangeEvent } from 'react'

interface Ipv6Props {
	onChange: (name: string, primary: string, secondary: string) => void
}

export function TabItemIpv6({ onChange }: Ipv6Props) {
	const [name, setName] = useState('')
	const [primaryDns, setPrimaryDns] = useState('')
	const [secondaryDns, setSecondaryDns] = useState('')
	const [validationMessage, setValidationMessage] = useState<string>('')

	useEffect(() => {
		if (isValidIPv6(primaryDns)) {
			onChange(name, primaryDns, secondaryDns)
			setValidationMessage('')
		} else if (primaryDns) {
			setValidationMessage('Invalid IPv6 address format')
		}
	}, [name, primaryDns, secondaryDns])

	const isValidIPv6 = (ip: string): boolean => {
		try {
			ip = ip.trim()

			if (!/^[0-9a-fA-F:]+$/.test(ip)) return false

			if (ip.includes('::')) {
				const parts = ip.split('::')
				if (parts.length > 2) return false

				const beforeParts = parts[0] ? parts[0].split(':') : []
				const afterParts = parts[1] ? parts[1].split(':') : []

				const zeroGroups = 8 - (beforeParts.length + afterParts.length)
				if (zeroGroups < 0) return false

				ip = [
					...beforeParts,
					...Array(zeroGroups).fill('0'),
					...afterParts,
				].join(':')
			}

			const groups = ip.split(':')

			if (groups.length !== 8) return false

			return groups.every((group) => {
				if (group === '') return false

				const num = Number.parseInt(group, 16)
				return num >= 0 && num <= 0xffff && group.length <= 4
			})
		} catch {
			return false
		}
	}

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	return (
		<div className={'grid'}>
			<div>
				<div className="label">
					<span className="label-text text-lg font-[balooTamma]">Name</span>
				</div>
				<input
					type="text"
					value={name}
					onChange={handleNameChange}
					placeholder="e.g. Google DNS IPv6"
					className="w-full h-8 max-w-xs text-gray-600 dark:text-gray-500 font-[Inter] outline outline-1
          outline-gray-700/20 dark:outline-none dark:placeholder-gray-50/20 rounded 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 
          pl-2 transition duration-200 ease-in-out"
				/>
			</div>
			<section className="mt-1">
				{validationMessage && (
					<Alert
						color="red"
						variant="ghost"
						className="text-[12px] border-l-4 border-[#c92e2e] dark:text-red-400 font-[Inter] h-2 text-center flex items-center mb-2"
					>
						{validationMessage}
					</Alert>
				)}
				<div className="flex flex-col gap-0">
					<div>
						<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
							Preferred DNS server:
							<span className="text-red-500 text-[20px]">*</span>
						</span>
						<input
							type="text"
							value={primaryDns}
							onChange={(e) => setPrimaryDns(e.target.value)}
							placeholder="2001:4860:4860::8888"
							className="w-full h-10 px-2 mt-1 font-mono text-sm border-none rounded outline outline-1 outline-gray-700/20 dark:outline-none dark:text-gray-300/95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 placeholder:text-gray-50 dark:placeholder-gray-50/20"
						/>
					</div>
					<div>
						<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
							Alternate DNS server:
						</span>
						<input
							type="text"
							value={secondaryDns}
							onChange={(e) => setSecondaryDns(e.target.value)}
							placeholder="2001:4860:4860::8844"
							className="w-full h-10 px-2 mt-1 font-mono text-sm border-none rounded outline outline-1 outline-gray-700/20 dark:outline-none dark:text-gray-300/95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 placeholder:text-gray-50 dark:placeholder-gray-50/20"
						/>
					</div>
				</div>
			</section>
		</div>
	)
}
