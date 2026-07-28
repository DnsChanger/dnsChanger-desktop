import { useEffect, useState } from 'react'
import { ServerStore } from '../../shared/interfaces/server.interface'

import { AddCustomDnsButton } from '../component/buttons/addDns-btn.component'
import { BenchmarkDnsButtonComponent } from '../component/buttons/benchmark-dns-btn.component'
import { ConnectButtonComponent } from '../component/buttons/connect-btn.component'
import { FlushDNS_BtnComponent } from '../component/buttons/flush-dns-btn-component'
import { InterfacesDialogButtonComponent } from '../component/buttons/interfaces-dialog-btn-component'

import { AdvertisementCardComponent } from '../component/cards/advertisement.card.component'
import { ServerInfoCardComponent } from '../component/cards/server-info'

import { ServersListSelectComponent } from '../component/selectes/servers'

import { serversContext } from '../context/servers.context'

export function HomePage() {
	const [serversState, setServers] = useState<ServerStore[]>([])
	const [currentActive, setCurrentActive] = useState<ServerStore | null>(null)
	const [network, setNetwork] = useState<string>()
	const [selectedServer, setSelectedServer] = useState<ServerStore | null>(null)
	const [loadingCurrentActive, setLoadingCurrentActive] = useState<boolean>(true)

	const osType = window.os.os

	useEffect(() => {
		async function fetchDnsList() {
			const response = await window.ipc.fetchDnsList()
			setServers(response.servers)
		}

		fetchDnsList()
	}, [])

	useEffect(() => {
		async function getCurrentActive() {
			if (!network) {
				setNetwork(window.storePreload.get('settings').network_interface)
				return
			}

			try {
				setSelectedServer(null)

				const response = await window.ipc.getCurrentActive()

				setCurrentActive(response.server)
				setSelectedServer(response.server)
			} finally {
				setLoadingCurrentActive(false)
			}
		}

		getCurrentActive()
	}, [network])

	return (
		<serversContext.Provider
			value={{
				servers: serversState,
				setServers,
				currentActive,
				setCurrentActive,
				selected: selectedServer,
				setSelected: setSelectedServer,
				network,
				setNetwork,
			}}
		>
			<div className="overflow-hidden">
				<div className="flex items-start h-full px-8 pt-5">
					{/* Connect Button */}
					<div className="flex justify-center pt-12 w-45 max-w-45">
						<ConnectButtonComponent />
					</div>

					<div className="relative flex flex-col gap-2 px-1 ml-auto w-96">
						<div className="flex absolute -left-11 -top-6 flex-col gap-2 pt-18.5">
							<AddCustomDnsButton />

							{(osType === 'win32' || osType === 'linux') && (
								<InterfacesDialogButtonComponent />
							)}

							<FlushDNS_BtnComponent />

							<BenchmarkDnsButtonComponent servers={serversState} />
						</div>
						<ServersListSelectComponent />

						<ServerInfoCardComponent
							loadingCurrentActive={loadingCurrentActive}
						/>

						<AdvertisementCardComponent />
					</div>
				</div>
			</div>
		</serversContext.Provider>
	)
}
