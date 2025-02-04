import { useEffect } from 'react'

export function DefaultComponent() {
	useEffect(() => {
		const defServer = window.storePreload.get('defaultServer')
		if (defServer?.servers) {
			setDNSAddressToInput('def-serverInput-1', defServer.servers[0])
			setDNSAddressToInput('def-serverInput-2', defServer.servers[1])
		}
	}, [])
	return (
		<div className={'grid'}>
			<div>
				<p className="text-[13px] dark:text-gray-400 font-[Inter] bg-[#f2f2f2] dark:bg-[#262626] p-2 rounded-md">
					Set the default DNS server for your system. This will be used when no
					custom server is set. (Optional)
				</p>
			</div>
			<div className={''}>
				<div className={'gap-1 grid grid-cols-1'} dir={'ltr'}>
					<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
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

					<div className="flex flex-row items-center justify-between w-full gap-2 mt-2">
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
	)
}

function setDNSAddressToInput(className: string, server: string) {
	const inputs: any = document.querySelectorAll(`.${className}`)
	let index = 0
	const dnsServerParts = server.split('.')
	for (const inp of inputs) {
		if (index === 4) return
		if (!dnsServerParts[index]) return
		inp.value = dnsServerParts[index]
		index++
	}
}
