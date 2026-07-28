import type React from 'react'
import { useEffect, useState } from 'react'

import { useI18nContext } from '../../../i18n/i18n-react'
import type { DnsProtocol } from '../../../shared/interfaces/server.interface'
import type { setState } from '../../interfaces/react.interface'
import { appNotif } from '../../notifications/appNotif'
import { Button } from '../button/button'
import { TextInput } from '../input/text-input'
import { TabNavigation } from '../tab/tab-navigation'
import Modal from './modal'

interface Props {
	isOpen: boolean
	setIsOpen: setState<boolean>
	cb: (val: any) => void
}

const ipv4Pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

type TabType = 'ipv4' | 'doh' | 'dot' | 'default'

export function AddDnsModalComponent(props: Props) {
	const [serverName, setServerName] = useState<string>('')
	const [validationMessage, setValidationMessage] = useState<string>('')
	const [dohUrl, setDohUrl] = useState('https://')
	const [dotHost, setDotHost] = useState('')
	const [bootstrapIp, setBootstrapIp] = useState('')

	const [type, setType] = useState<TabType>('ipv4')
	const { LL } = useI18nContext()

	useEffect(() => {
		if (!props.isOpen) return
		const defServer = window.storePreload.get('defaultServer')
		if (defServer && defServer.servers) {
			setDNSAddressToInput('def-serverInput-1', defServer.servers[0])
			setDNSAddressToInput('def-serverInput-2', defServer.servers[1])
		}

		navigator.clipboard.readText().then(clipboardHandler)

		setValidationMessage('')
	}, [props.isOpen])

	const handleOpen = () => props.setIsOpen((cur) => !cur)

	async function addHandler() {
		try {
			let resp: any

			if (type === 'default') {
				const nameServer1Default = getNameServer('def-serverInput-1')
				if (!nameServer1Default || !ipv4Pattern.test(nameServer1Default)) {
					setValidationMessage(`Invalid DNS Address ${nameServer1Default}`)
					return
				}

				const nameServer2Default = getNameServer('def-serverInput-2')
				if (nameServer2Default && !ipv4Pattern.test(nameServer2Default)) {
					setValidationMessage(`Invalid DNS Address ${nameServer2Default}`)
					return
				}

				resp = await window.ipc.addDns({
					name: 'default',
					servers: [nameServer1Default, nameServer2Default],
					protocol: 'plain',
				})
			} else if (type === 'doh' || type === 'dot') {
				if (!serverName) {
					setValidationMessage('Server name cannot be empty')
					return
				}
				if (serverName === 'default') {
					return appNotif('Error', 'Server name cannot be "default"', 'ERROR')
				}

				const protocol: DnsProtocol = type
				const servers =
					bootstrapIp && ipv4Pattern.test(bootstrapIp) ? [bootstrapIp] : []

				if (type === 'doh') {
					resp = await window.ipc.addDns({
						name: serverName,
						servers,
						protocol,
						dohUrl: dohUrl.trim(),
					})
				} else {
					resp = await window.ipc.addDns({
						name: serverName,
						servers,
						protocol,
						dotHost: dotHost.trim(),
					})
				}
			} else {
				if (!serverName)
					return setValidationMessage('Server name cannot be empty')
				if (serverName === 'default')
					return appNotif('Error', 'Server name cannot be "default"', 'ERROR')

				const nameServer1 = getNameServer('serverInput-1')
				if (!nameServer1 || !ipv4Pattern.test(nameServer1)) {
					setValidationMessage(`Invalid DNS Address ${nameServer1}`)
					return
				}

				const nameServer2 = getNameServer('serverInput-2')
				if (nameServer2 && !ipv4Pattern.test(nameServer2)) {
					setValidationMessage(`Invalid DNS Address ${nameServer2}`)
					return
				}

				resp = await window.ipc.addDns({
					name: serverName,
					servers: [nameServer1, nameServer2],
					protocol: 'plain',
				})
			}

			props.setIsOpen(false)
			if (resp.success) {
				if (resp.server.name === 'default')
					appNotif(
						'Success',
						'Default DNS server has been set/updated',
						'SUCCESS'
					)
				else {
					appNotif(
						'Success',
						LL.dialogs.added_server({ serverName: serverName }),
						'SUCCESS'
					)
				}

				setServerName('')
				setDohUrl('https://')
				setDotHost('')
				setBootstrapIp('')

				if (resp.server.name !== 'default') props.cb(resp.server)
			} else {
				appNotif('Error', resp.message, 'ERROR')
			}
		} catch (e) {
			console.error(e)
		}
	}

	async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value
		if (!value) {
			const prevInput: any = e.target.previousElementSibling
			if (!prevInput) return
			if (prevInput.tagName === 'SPAN' && prevInput.previousElementSibling) {
				prevInput.previousElementSibling.focus()
				return
			}
			if (prevInput) {
				prevInput.focus()
			}
		}

		const regex = /^[0-9]{1,3}$/

		if (!regex.test(value)) {
			e.target.value = value.slice(0, -1)
			return
		}

		if (value.length === 3) {
			const nextInput: any = e.target.nextElementSibling
			if (!nextInput) return

			if (nextInput.tagName === 'SPAN' && nextInput.nextElementSibling) {
				nextInput.nextElementSibling.focus()
				return
			}
			if (nextInput) {
				nextInput.focus()
			}
		}
	}

	function getNameServer(className: string): string | null {
		const inputs: any = document.querySelectorAll(`.${className}`)
		let server = ''
		inputs.forEach((inp: any) => {
			if (!inp.value) return
			server += inp.value
			if (inp.nextElementSibling && inp.nextElementSibling.tagName === 'SPAN') {
				server += '.'
			}
		})
		return server
	}

	function setDNSAddressToInput(className: string, server: string) {
		const inputs: any = document.querySelectorAll(`.${className}`)
		let index = 0
		const splietedServer = server.split('.')
		inputs.forEach((inp: any) => {
			if (index === 4) return
			if (!splietedServer[index]) return
			inp.value = splietedServer[index]
			index++
		})
	}

	function clipboardHandler(clipText: string | null) {
		if (!clipText) return

		if (clipText.startsWith('https://')) {
			setType('doh')
			setDohUrl(clipText.trim())
			return
		}

		if (!clipText.includes('.')) return

		let servers = clipText.split(',') as string[]
		if (servers.length === 2) {
			if (ipv4Pattern.test(servers[0]))
				setDNSAddressToInput('serverInput-1', servers[0])
			if (ipv4Pattern.test(servers[1]))
				setDNSAddressToInput('serverInput-2', servers[1])
			return
		}

		servers = clipText.split(' ')
		if (servers.length === 2) {
			if (ipv4Pattern.test(servers[0]))
				setDNSAddressToInput('serverInput-1', servers[0])

			if (ipv4Pattern.test(servers[1]))
				setDNSAddressToInput('serverInput-2', servers[1])
			return
		}

		if (ipv4Pattern.test(clipText)) setDNSAddressToInput('serverInput-1', clipText)
	}

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={() => props.setIsOpen(false)}
			size="md"
			title="Add Server"
		>
			<div className="flex flex-col gap-2 py-2">
				<TabNavigation
					tabs={[
						{ id: 'ipv4', label: 'IPv4' },
						{ id: 'doh', label: 'DoH' },
						{ id: 'dot', label: 'DoT' },
						{ id: 'default', label: 'Default' },
					]}
					activeTab={type}
					tabMode="simple"
					onTabClick={(val) => setType(val as TabType)}
				/>

				{validationMessage && (
					<div className="text-[12px] alert alert-error font-[Inter] text-center flex items-center">
						{validationMessage}
					</div>
				)}

				{type === 'ipv4' ? (
					<div className={'px-2 flex flex-col gap-y-2'}>
						<div>
							<span className="label-text text-lg font-[balooTamma]">
								Name
							</span>
							<TextInput
								onChange={(v) => setServerName(v)}
								value={serverName}
								placeholder="enter server name"
							/>
						</div>

						<div className={'flex flex-col h-full w-full'}>
							<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
								<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
									Preferred DNS server:
									<span className="text-red-500 text-[20px]">*</span>
								</span>
								<div>
									{[1, 2, 3, 4].map((i, index) =>
										InputDNS(index, `serverInput-1`, onChange)
									)}
								</div>
							</div>

							<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
								<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
									Alternate DNS server:
								</span>
								<div>
									{[1, 2, 3, 4].map((i, index) =>
										InputDNS(index, 'serverInput-2', onChange)
									)}
								</div>
							</div>
						</div>
					</div>
				) : null}

				{type === 'doh' ? (
					<div className="flex flex-col gap-2 px-2">
						<p className="text-[12px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
							DNS-over-HTTPS endpoint (e.g. AdGuard Home:
							https://example.com/dns-query)
						</p>
						<span className="label-text text-lg font-[balooTamma]">Name</span>
						<TextInput
							onChange={setServerName}
							value={serverName}
							placeholder="My DoH server"
						/>
						<span className="label-text text-lg font-[balooTamma]">
							DoH URL
						</span>
						<TextInput
							onChange={setDohUrl}
							value={dohUrl}
							placeholder="https://dns.example/dns-query"
						/>
						<span className="label-text text-lg font-[balooTamma]">
							Bootstrap IP (optional)
						</span>
						<TextInput
							onChange={setBootstrapIp}
							value={bootstrapIp}
							placeholder="1.1.1.1"
						/>
					</div>
				) : null}

				{type === 'dot' ? (
					<div className="flex flex-col gap-2 px-2">
						<p className="text-[12px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
							DNS-over-TLS hostname on port 853 (host or host:port)
						</p>
						<span className="label-text text-lg font-[balooTamma]">Name</span>
						<TextInput
							onChange={setServerName}
							value={serverName}
							placeholder="My DoT server"
						/>
						<span className="label-text text-lg font-[balooTamma]">
							DoT hostname
						</span>
						<TextInput
							onChange={setDotHost}
							value={dotHost}
							placeholder="dns.example.com"
						/>
						<span className="label-text text-lg font-[balooTamma]">
							Bootstrap IP (optional)
						</span>
						<TextInput
							onChange={setBootstrapIp}
							value={bootstrapIp}
							placeholder="1.1.1.1"
						/>
					</div>
				) : null}

				{type === 'default' ? (
					<div>
						<div className={'grid'}>
							<div>
								<p className="text-[13px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
									Set the default DNS server for your system. This will
									be used when no custom server is set. (Optional)
								</p>
							</div>
							<div className={''}>
								<div className={'gap-1 grid grid-cols-1'} dir={'ltr'}>
									<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
										<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
											Preferred DNS server:
											<span className="text-red-500 text-[20px]">
												*
											</span>
										</span>
										<div>
											{[1, 2, 3, 4].map((i, index) =>
												InputDNS(
													index,
													'def-serverInput-1',
													onChange
												)
											)}
										</div>
									</div>

									<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
										<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
											Alternate DNS server:
										</span>
										<div>
											{[1, 2, 3, 4].map((i, index) =>
												InputDNS(
													index,
													'def-serverInput-2',
													onChange
												)
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}

				<div className="flex flex-row gap-2">
					<Button
						size="md"
						className="normal-case font-[balooTamma]  rounded-xl"
						onClick={handleOpen}
					>
						Close
					</Button>
					<Button
						size="md"
						isPrimary
						className={'flex-1 normal-case  font-[balooTamma] rounded-xl'}
						onClick={addHandler}
					>
						Add
					</Button>
				</div>
			</div>
		</Modal>
	)
}

function InputDNS(index: number, className: string, onChange: any) {
	return (
		<>
			<input
				key={index}
				type="text"
				className={`${className} input w-10 p-0! h-10 rounded-xl font-[Inter] outline-none! transition-all duration-300 focus:ring-1 focus:ring-primary/20 focus:border-primary text-center`}
				maxLength={3}
				onChange={onChange}
			/>
			{index === 3 ? null : (
				<span className="text-gray-400  font-[balooTamma]">.</span>
			)}
		</>
	)
}
