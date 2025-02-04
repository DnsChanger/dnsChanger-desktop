import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Dialog,
} from '@material-tailwind/react'
import React, { useState } from 'react'
import { BiCommentError } from 'react-icons/bi'
import { FaCheck, FaCopy } from 'react-icons/fa'

interface Props {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function WmicHelperModal(props: Props) {
	const handleOpen = () => props.setIsOpen((cur) => !cur)
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(
			'DISM /Online /Add-Capability /CapabilityName:WMIC~~~~',
		)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Dialog
			size="md"
			open={props.isOpen}
			handler={handleOpen}
			className="bg-transparent shadow-none"
		>
			<Card className="mx-auto w-96 dark:bg-[#282828]">
				<div className="mb-0 p-2 bg-[#f2f2f2] dark:bg-[#262626] dark:text-gray-400 rounded-t-2xl flex flex-row justify-between">
					<div className="ml-3 font-[balooTamma] text-1xl flex flex-row items-center gap-1 text-red-400/80">
						<BiCommentError />
						WMIC Not Installed
					</div>
				</div>

				<CardBody className="flex flex-col py-2">
					<p className="text-[13px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
						It looks like WMIC is not installed on your system. WMIC is required
						for this application to function properly. Please follow the
						instructions below to install WMIC.
					</p>
					<div className="mt-4">
						<p className="text-[13px] dark:text-gray-400 font-[Inter]">
							1. Open Command Prompt as Administrator.
						</p>
						<p className="text-[13px] dark:text-gray-400 font-[Inter]">
							2. Run the following command:
						</p>
						<div className="relative mt-2">
							<div className="absolute p-2 rounded-lg left-1 top-1 backdrop-blur-md">
								<Button
									variant="text"
									className=" rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 normal-case font-[balooTamma] text-sm bg-gray-300/80 dark:bg-gray-700 dark:text-gray-400"
									size="sm"
									onClick={() => handleCopy()}
								>
									{copied ? (
										<FaCheck className="w-4 h-4 text-green-500" />
									) : (
										<FaCopy className="w-4 h-4" />
									)}
								</Button>
							</div>

							<pre className="pl-20 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-[13px] font-mono border border-gray-200 dark:border-gray-700 dark:text-gray-300 overflow-x-auto">
								DISM /Online /Add-Capability /CapabilityName:WMIC~~~~​
							</pre>
						</div>
						<p className="text-[13px] dark:text-gray-400 font-[Inter]">
							3. Restart your computer.
						</p>
					</div>
				</CardBody>

				<CardFooter className="flex flex-row justify-between py-2 pt-0">
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
						variant="text"
						className="normal-case font-[balooTamma] text-xl"
						color="blue"
						size="sm"
						onClick={() =>
							window.open(
								'https://github.com/DnsChanger/dnsChanger-desktop/issues/74',
								'_blank',
							)
						}
					>
						Can't Install?
					</Button>
				</CardFooter>
			</Card>
		</Dialog>
	)
}
