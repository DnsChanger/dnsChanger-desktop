import React, { useEffect, useState } from 'react'

import { setState } from '../../interfaces/react.interface'
import { useI18nContext } from '../../../i18n/i18n-react'
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Dialog,
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
	Alert,
} from '@material-tailwind/react'
import { appNotif } from '../../notifications/appNotif'

interface Props {
	isOpen: boolean
	setIsOpen: setState<boolean>
	cb: (val: any) => void
}

const ipv4Pattern = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/

export function AddDnsModalComponent(props: Props) {
	const [serverName, setServerName] = useState<string>('')
	const [validationMessage, setValidationMessage] = useState<string>('')

	const [type, setType] = useState<'ipv4' | 'default'>('ipv4')
	const { LL } = useI18nContext()

	useEffect(() => {
		if (!props.isOpen) return
		const defServer = window.storePreload.get('defaultServer')
		if (defServer && defServer.servers) {
			setDNSAddressToInput('def-serverInput-1', defServer.servers[0])
			setDNSAddressToInput('def-serverInput-2', defServer.servers[1])
		}

		// fetch from clipboard
		navigator.clipboard.readText().then(clipboardHandler)

		setValidationMessage('')
	}, [props.isOpen])

	const handleOpen = () => props.setIsOpen((cur) => !cur)

	async function addHandler() {
		try {
			let resp

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
				})
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
				console.log('nameServer2', nameServer2, ipv4Pattern.test(nameServer2))
				if (nameServer2 && !ipv4Pattern.test(nameServer2)) {
					setValidationMessage(`Invalid DNS Address ${nameServer2}`)
					return
				}

				resp = await window.ipc.addDns({
					name: serverName,
					servers: [nameServer1, nameServer2],
				})
			}

			props.setIsOpen(false)
			if (resp.success) {
				if (resp.server.name === 'default')
					appNotif(
						'Success',
						'Default DNS server has been set/updated',
						'SUCCESS',
					)
				else {
					appNotif(
						'Success',
						LL.dialogs.added_server({ serverName: serverName }),
						'SUCCESS',
					)
				}

				setServerName('')

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
		// validate value is a DNS Address
		if (!value) {
			//back to previous input
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

			// ignore "." element
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

		if (!clipText.includes('.')) return

		let servers = clipText.split(',') as string[]
		if (servers.length == 2) {
			if (ipv4Pattern.test(servers[0]))
				setDNSAddressToInput('serverInput-1', servers[0])
			if (ipv4Pattern.test(servers[1]))
				setDNSAddressToInput('serverInput-2', servers[1])
			return
		}

		servers = clipText.split(' ')
		if (servers.length == 2) {
			if (ipv4Pattern.test(servers[0]))
				setDNSAddressToInput('serverInput-1', servers[0])

			if (ipv4Pattern.test(servers[1]))
				setDNSAddressToInput('serverInput-2', servers[1])
			return
		}

		if (ipv4Pattern.test(clipText))
			setDNSAddressToInput('serverInput-1', clipText)
	}

	return (
		<Dialog
			size="xl"
			open={props.isOpen}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<Card className="mx-auto w-96 dark:bg-[#282828]">
				<div className="mb-0 p-2 bg-[#f2f2f2] dark:bg-[#262626] dark:text-gray-400 rounded-t-2xl  place-items-center flex flex-row justify-between">
					<div className="ml-3 font-[balooTamma] text-1xl">Custom Server</div>
				</div>

				<CardBody className="flex flex-col py-2">
					<Tabs value={type}>
						<TabsHeader
							className="bg-gray-300 dark:bg-[#262626]"
							indicatorProps={{ className: 'bg-[#7487FF]' }}
						>
							<Tab
								value="ipv4"
								className="dark:text-gray-200 font-[balooTamma]"
								onClick={() => setType('ipv4')}
							>
								IPV4
							</Tab>
							<Tab
								value="default"
								className="dark:text-gray-200 font-[balooTamma]"
								onClick={() => setType('default')}
							>
								Default
							</Tab>
						</TabsHeader>
						<TabsBody>
							<TabPanel value="ipv4">
								<div className={'grid'}>
									<div>
										<div className="label">
											<span className="label-text text-lg font-[balooTamma]">
												Name
											</span>
										</div>
										<input
											type="text"
											onChange={(e) => setServerName(e.target.value)}
											value={serverName}
											defaultValue={serverName}
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

											<div className="flex flex-row w-full gap-2 justify-between items-center mt-2">
												<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
													Preferred DNS server:
													<span className="text-red-500 text-[20px]">*</span>
												</span>
												<div>
													{[1, 2, 3, 4].map((i, index) =>
														InputDNS(index, 'serverInput-1', onChange),
													)}
												</div>
											</div>

											<div className="flex flex-row w-full gap-2 justify-between items-center mt-2">
												<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
													Alternate DNS server:
												</span>
												<div>
													{[1, 2, 3, 4].map((i, index) =>
														InputDNS(index, 'serverInput-2', onChange),
													)}
												</div>
											</div>
										</div>
									</section>
								</div>
							</TabPanel>
							<TabPanel value="default">
								<div className={'grid'}>
									<div>
										<p className="text-[13px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
											Set the default DNS server for your system. This will be
											used when no custom server is set. (Optional)
										</p>
									</div>
									<div className={''}>
										<div className={'gap-1 grid grid-cols-1'} dir={'ltr'}>
											<div className="flex flex-row w-full gap-2 justify-between items-center mt-2">
												<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
													Preferred DNS server:
													<span className="text-red-500 text-[20px]">*</span>
												</span>
												<div>
													{[1, 2, 3, 4].map((i, index) =>
														InputDNS(index, 'def-serverInput-1', onChange),
													)}
												</div>
											</div>

											<div className="flex flex-row w-full gap-2 justify-between items-center mt-2">
												<span className="text-gray-700 font-[balooTamma] dark:text-gray-300 text-[12px]">
													Alternate DNS server:
												</span>
												<div>
													{[1, 2, 3, 4].map((i, index) =>
														InputDNS(index, 'def-serverInput-2', onChange),
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</CardBody>
				<CardFooter className="pt-0 flex flex-row py-2">
					<Button
						variant="text"
						className="normal-case font-[balooTamma] text-xl"
						color="red"
						size="sm"
						onClick={handleOpen}
					>
						Close
					</Button>
					<Button
						variant="gradient"
						color={'green'}
						size="md"
						className={
							'flex-1  normal-case bg-[#7487FF] font-[balooTamma] text-sm ml-5'
						}
						onClick={addHandler}
					>
						Add
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}

function InputDNS(index: number, className: string, onChange: any) {
	return (
		<>
			<input
				key={index}
				type="text"
				className={`${className} w-10 h-10 border-none rounded font-[Inter] outline outline-1 outline-gray-700/20  dark:outline-none dark:text-gray-300/95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 text-center`}
				maxLength={3}
				onChange={onChange}
			/>
			{index === 3 ? null : (
				<span className="text-gray-400  font-[balooTamma]">.</span>
			)}
		</>
	)
}
