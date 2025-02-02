import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { ServerStore } from '../../shared/interfaces/server.interface'
import { AddCustomDnsButton } from '../component/buttons/addDns-btn.component'
import { ConnectButtonComponent } from '../component/buttons/connect-btn.component'
import { DeleteButtonComponent } from '../component/buttons/delete-btn.component'
import { FlushDNS_BtnComponent } from '../component/buttons/flush-dns-btn-component'
import { InterfacesDialogButtonComponent } from '../component/buttons/interfaces-dialog-btn-component'
import { ToggleButtonComponent } from '../component/buttons/togglePin-btn.component'
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
		<div className="container">
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
				<div className="px-0  p-4 hero-content text-center max-w-[500px]   mb-1 ">
					<div className="max-w-full  pt-[100px] pb-[100px] pr-[30px] pl-[30px] p-1">
						<div className={'flex  flex-row gap-10'}>
							<div className={'absolute right-[550px] flex-grow-0'}>
								<div className={'flex flex-col'}>
									<ConnectButtonComponent />
								</div>
							</div>

							<div className={'absolute right-[50px] top-[90px]'}>
								<div className={'flex flex-col'}>
									<div className={'flex-none'}>
										<ServersListSelectComponent />
									</div>
									<ServerInfoCardComponent
										loadingCurrentActive={loadingCurrentActive}
									/>
								</div>
								<div
									className={
										'absolute bottom-[60px] right-[368px] flex flex-col gap-y-2'
									}
								>
									<AddCustomDnsButton />
									{osType == 'win32' && <InterfacesDialogButtonComponent />}
									<FlushDNS_BtnComponent />
								</div>
							</div>
							<div
								className={
									'absolute top-[330px] left-[360px] grid grid-cols-10 gap-10'
								}
							>
								<DeleteButtonComponent />
								<ToggleButtonComponent />
							</div>
						</div>
					</div>
					<WmicHelperModal
						isOpen={isWmicModalOpen}
						setIsOpen={setIsWmicModalOpen}
					/>
				</div>
			</serversContext.Provider>
		</div>
	)
}
