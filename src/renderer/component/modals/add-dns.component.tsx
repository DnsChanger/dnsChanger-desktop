import {
	Alert,
	Button,
	Card,
	CardBody,
	CardFooter,
	Dialog,
	Tab,
	TabPanel,
	Tabs,
	TabsBody,
	TabsHeader,
} from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { appNotif } from '../../notifications/appNotif'
import { Ipv4Component } from './addDns/ipv4/ipv4.component'
import { TabItemIpv6 } from './addDns/ipv6/ipv6.component'

interface Props {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	cb: (val: any) => void
}

export function AddDnsModalComponent(props: Props) {
	const [serverName, setServerName] = useState<string>('')
	const [validationMessage, setValidationMessage] = useState<string>('')
	const [type, setType] = useState<'ipv4' | 'ipv6'>('ipv4')
	const [dnsData, setDnsData] = useState<{
		name: string
		primary: string
		secondary: string
	} | null>(null)

	useEffect(() => {
		if (!props.isOpen) return
		setValidationMessage('')
		setDnsData(null)
	}, [props.isOpen])

	const handleOpen = () => props.setIsOpen((cur) => !cur)

	const onChange = (name: string, primary: string, secondary: string) => {
		setDnsData({ name, primary, secondary })
	}

	const addHandler = async () => {
		if (!dnsData) {
			setValidationMessage('Please fill in DNS details')
			return
		}

		if (!dnsData.name) {
			setValidationMessage('Server name cannot be empty')
			return
		}

		if (dnsData.name === 'default') {
			setValidationMessage('Server name cannot be "default"')
			return
		}

		try {
			const resp = await window.ipc.addDns({
				name: dnsData.name,
				servers: [dnsData.primary, dnsData.secondary].filter(Boolean),
				type: type,
			})

			props.setIsOpen(false)
			if (resp.success) {
				appNotif(
					'Success',
					`Server ${serverName} successfully added.`,
					'SUCCESS',
				)
				props.cb(resp.server)
			} else {
				appNotif('Error', resp.message, 'ERROR')
			}

			console.log('Add DNS:', dnsData, type)
		} catch (error) {
			console.error(error)
			appNotif('Error', 'Failed to add server', 'ERROR')
		} finally {
			setServerName('')
			setDnsData(null)
			setValidationMessage('')
		}
	}

	return (
		<Dialog
			size="xl"
			open={props.isOpen}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<Card className="mx-auto w-96 dark:bg-[#282828]">
				<div className="mb-0 p-2 bg-[#f2f2f2] dark:bg-[#262626] dark:text-gray-400 rounded-t-2xl flex flex-row justify-between">
					<div className="ml-3 font-[balooTamma] text-1xl">Custom Server</div>
				</div>

				<CardBody className="flex flex-col py-2">
					{validationMessage && (
						<Alert color="red" className="mb-2">
							{validationMessage}
						</Alert>
					)}

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
								value="ipv6"
								className="dark:text-gray-200 font-[balooTamma]"
								onClick={() => setType('ipv6')}
							>
								IPV6
							</Tab>
						</TabsHeader>
						<TabsBody>
							<TabPanel value="ipv4">
								<Ipv4Component onChange={onChange} />
							</TabPanel>
							<TabPanel value="ipv6">
								<TabItemIpv6 onChange={onChange} />
							</TabPanel>
						</TabsBody>
					</Tabs>
				</CardBody>
				<CardFooter className="flex flex-row py-2 pt-0">
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
						color="green"
						size="md"
						className="flex-1 normal-case bg-[#7487FF] font-[balooTamma] text-sm ml-5"
						onClick={addHandler}
					>
						Add
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}
