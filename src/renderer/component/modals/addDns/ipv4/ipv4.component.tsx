import { Alert } from '@material-tailwind/react'
import React, { useState, useEffect, ChangeEvent, useRef } from 'react'

interface Ipv4Props {
	onChange: (name: string, primary: string, secondary: string) => void
}

export function Ipv4Component({ onChange }: Ipv4Props) {
	const [name, setName] = useState('')
	const [validationMessage, setValidationMessage] = useState<string>('')
	const [primaryDns, setPrimaryDns] = useState<string[]>(['', '', '', ''])
	const [secondaryDns, setSecondaryDns] = useState<string[]>(['', '', '', ''])

	// Create refs for inputs
	const primaryInputRefs = useRef<(HTMLInputElement | null)[]>([
		null,
		null,
		null,
		null,
	])
	const secondaryInputRefs = useRef<(HTMLInputElement | null)[]>([
		null,
		null,
		null,
		null,
	])

	useEffect(() => {
		const primary = primaryDns.join('.')
		const secondary = secondaryDns.join('.')

		if (isValidIP(primary)) {
			console.log(
				'Primary DNS:',
				primary,
				'Secondary DNS:',
				secondary,
				'Name:',
				name,
			)
			onChange(name, primary, secondary)
			setValidationMessage('')
		} else if (primary.split('.').some((part) => part !== '')) {
			setValidationMessage('Invalid IP address format')
		}
	}, [name, primaryDns, secondaryDns])

	const isValidIP = (ip: string): boolean => {
		const parts = ip.split('.')
		return (
			parts.length === 4 &&
			parts.every((part) => {
				const num = Number.parseInt(part || '0')
				return part === '' || (num >= 0 && num <= 255)
			})
		)
	}

	const handleInputChange = (
		index: number,
		value: string,
		isDns: 'primary' | 'secondary',
	) => {
		const updateDns = isDns === 'primary' ? setPrimaryDns : setSecondaryDns
		const inputRefs =
			isDns === 'primary' ? primaryInputRefs : secondaryInputRefs

		updateDns((prev) => {
			const newDns = [...prev]
			newDns[index] = value

			// Auto-tab to next input when max length is reached
			if (value.length === 3 && index < 3) {
				inputRefs.current[index + 1]?.focus()
			}

			return newDns
		})
	}

	const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const renderDnsInputs = (
		dnsValues: string[],
		isDns: 'primary' | 'secondary',
	) => {
		const inputRefs =
			isDns === 'primary' ? primaryInputRefs : secondaryInputRefs

		return dnsValues.map((value, index) => (
			<React.Fragment key={index}>
				<input
					ref={(el) => {
						if (inputRefs.current) {
							inputRefs.current[index] = el
						}
					}}
					type="text"
					value={value}
					className={`w-10 h-10 border-none rounded font-[Inter] outline outline-1 outline-gray-700/20 dark:outline-none dark:text-gray-300/95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 text-center`}
					maxLength={3}
					onChange={(e) => {
						const inputValue = e.target.value.replace(/[^0-9]/g, '')
						handleInputChange(index, inputValue, isDns)
					}}
					onKeyDown={(e) => {
						// Handle backspace to move to previous input if current input is empty
						if (e.key === 'Backspace' && value === '' && index > 0) {
							inputRefs.current[index - 1]?.focus()
						}
					}}
				/>
				{index < 3 && (
					<span className="text-gray-400 font-[balooTamma]">.</span>
				)}
			</React.Fragment>
		))
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
					placeholder="e.g. Google DNS"
					className="w-full h-8 max-w-xs text-gray-600 dark:text-gray-500 font-[Inter] outline outline-1
            outline-gray-700/20
            dark:outline-none
            dark:placeholder-gray-50/20 rounded focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-indigo-500 pl-2 transition duration-200 ease-in-out"
				/>
			</div>
			<section className="mt-2">
				<div className={'flex flex-col h-full w-full'} dir={'ltr'}>
					{validationMessage && (
						<Alert
							color="red"
							variant="ghost"
							className="text-[12px] border-l-4 border-[#c92e2e] dark:text-red-400 font-[Inter] h-2 text-center flex items-center"
						>
							{validationMessage}
						</Alert>
					)}

					<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
						<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
							Preferred DNS server:
							<span className="text-red-500 text-[20px]">*</span>
						</span>
						<div className="flex items-center">
							{renderDnsInputs(primaryDns, 'primary')}
						</div>
					</div>

					<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
						<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
							Alternate DNS server:
						</span>
						<div className="flex items-center">
							{renderDnsInputs(secondaryDns, 'secondary')}
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
