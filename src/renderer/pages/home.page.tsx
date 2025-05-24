import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { ServerStore } from '../../shared/interfaces/server.interface'
import { AddCustomDnsButton } from '../component/buttons/addDns-btn.component'
import { ConnectButtonComponent } from '../component/buttons/connect-btn.component'
import { DeleteButtonComponent } from '../component/buttons/delete-btn.component'
import { FlushDNS_BtnComponent } from '../component/buttons/flush-dns-btn-component'
import { InterfacesDialogButtonComponent } from '../component/buttons/interfaces-dialog-btn-component'
import { ToggleButtonComponent } from '../component/buttons/togglePin-btn.component'
import { AdvertisementCardComponent } from '../component/cards/advertisement.card.component'
import { ServerInfoCardComponent } from '../component/cards/server-info'
import { WmicHelperModal } from '../component/modals/wmic-helper.modal'
import { ServersListSelectComponent } from '../component/selectes/servers'
import { serversContext } from '../context/servers.context'

export function HomePage() {
	const [serversState, setServers] = useState<ServerStore[]>([])
	const [currentActive, setCurrentActive] = useState<ServerStore | null>(null)
	const [network, setNetwork] = useState<string>()
	const [selectedServer, setSelectedServer] = useState<ServerStore | null>(null)
	const [loadingCurrentActive, setLoadingCurrentActive] =
		useState<boolean>(true)
	const [isWmicModalOpen, setIsWmicModalOpen] = useState(false)

	const osType = window.os.os
	useEffect(() => {
		async function fetchDnsList() {
			const response = await window.ipc.fetchDnsList()
			setServers(response.servers)
		}

		const handleOpenModal = () => {
			setIsWmicModalOpen(true)
			ReactGA.event({
				category: 'User',
				action: 'WMIC_HELPER_MODAL',
				label: 'WMIC_HELPER_MODAL',
				value: 1,
			})
		}
		window.addEventListener('wmic-helper-modal', handleOpenModal)

		fetchDnsList()

		return () => {
			window.removeEventListener('wmic-helper-modal', handleOpenModal)
		}
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
		<div className="w-full h-[370px] min-h-[370px] max-h-[370px]">
			<serversContext.Provider
				value={{
					servers: serversState,
					setServers: setServers,
					currentActive: currentActive,
					setCurrentActive,
					selected: selectedServer,
					setSelected: setSelectedServer,
					network: network,
					setNetwork: setNetwork,
				}}
			>
				{/* Main layout container - using flex instead of absolute positioning */}
				<div className="flex flex-row items-start justify-around p-5">
					{/* Left section - Connect button */}
					<div className="items-start self-center flex-none">
						<div className="flex flex-col">
							<ConnectButtonComponent />
						</div>
					</div>

					{/* Middle section - Server controls */}
					{/* <div className="flex flex-col items-center justify-center">
							<DeleteButtonComponent />
							<ToggleButtonComponent />
						</div> */}

					{/* Right section - Server info and options */}
					<div className="flex-none">
						<div className="flex flex-col gap-1">
							<div className="flex-none">
								<ServersListSelectComponent />
							</div>

							<ServerInfoCardComponent
								loadingCurrentActive={loadingCurrentActive}
							/>

							<AdvertisementCardComponent />

							{/* Action buttons */}
							{/* <div className="flex flex-row justify-end gap-2 mt-4">
									<AddCustomDnsButton />
									{osType == 'win32' && <InterfacesDialogButtonComponent />}
									<FlushDNS_BtnComponent />
								</div> */}
						</div>
					</div>
				</div>

				<WmicHelperModal
					isOpen={isWmicModalOpen}
					setIsOpen={setIsWmicModalOpen}
				/>
			</serversContext.Provider>
		</div>
	)
}
