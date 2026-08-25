import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdLan, MdWifi, MdRefresh, MdCheckCircle } from 'react-icons/md'
import { TbNetwork } from 'react-icons/tb'
import { settingStore } from '../../app'
import { serversContext } from '../../context/servers.context'
import type { setState } from '../../interfaces/react.interface'
import type { ServersContext } from '../../interfaces/servers-context.interface'
import Modal from './modal'
import { Button } from '../button/button'

interface NetworkInterfaceItem {
	name: string
	type: string
	ip_address?: string
	mac_address?: string
	gateway_ip?: string | null
}

interface Props {
	isOpen: boolean
	setIsOpen: setState<boolean>
	cb?: (val: any) => void
}

type FilterType = 'all' | 'lan' | 'wifi'

export function NetworkOptionsModalComponent(props: Props) {
	const { setNetwork, network } = useContext<ServersContext>(serversContext)
	const [loading, setLoading] = useState<boolean>(true)
	const [interfaces, setInterfaces] = useState<NetworkInterfaceItem[]>([])
	const [activeFilter, setActiveFilter] = useState<FilterType>('all')

	const fetchNetworkInterfaces = async () => {
		setLoading(true)
		try {
			const list: NetworkInterfaceItem[] = await window.os.getInterfaces()
			if (Array.isArray(list)) {
				setInterfaces(list)
			}
		} catch (err) {
			toast.error('Failed to load network interfaces')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (props.isOpen) {
			const current = window.storePreload.get('settings').network_interface
			setNetwork(current)
			fetchNetworkInterfaces()
		}
	}, [props.isOpen])

	const handleSelectInterface = (name: string) => {
		settingStore.network_interface = name
		window.ipc.saveSettings(settingStore).catch(() => {})
		setNetwork(name)
		toast.success(`Network interface set to: ${name === 'Auto' ? 'Auto Detect' : name}`)
	}

	if (!props.isOpen) return null

	const currentSelected = network || window.storePreload.get('settings').network_interface || 'Auto'

	const filteredInterfaces = interfaces.filter((item) => {
		if (activeFilter === 'lan') return item.type === 'Wired'
		if (activeFilter === 'wifi') return item.type === 'Wireless'
		return true
	})

	const lanCount = interfaces.filter((i) => i.type === 'Wired').length
	const wifiCount = interfaces.filter((i) => i.type === 'Wireless').length

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={() => props.setIsOpen(false)}
			title={
				<div className="flex items-center gap-2">
					<TbNetwork className="text-primary text-xl" />
					<span>Network Switcher</span>
				</div>
			}
			size="md"
		>
			<div className="space-y-4 py-1">
				<div className="flex items-center justify-between gap-2 border-b border-base-300 pb-3">
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => setActiveFilter('all')}
							className={`btn btn-xs rounded-lg font-medium ${
								activeFilter === 'all'
									? 'btn-primary'
									: 'btn-ghost text-base-content/70 hover:text-base-content'
							}`}
						>
							All ({interfaces.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveFilter('lan')}
							className={`btn btn-xs rounded-lg font-medium gap-1 ${
								activeFilter === 'lan'
									? 'btn-primary'
									: 'btn-ghost text-base-content/70 hover:text-base-content'
							}`}
						>
							<MdLan size={14} />
							LAN ({lanCount})
						</button>
						<button
							type="button"
							onClick={() => setActiveFilter('wifi')}
							className={`btn btn-xs rounded-lg font-medium gap-1 ${
								activeFilter === 'wifi'
									? 'btn-primary'
									: 'btn-ghost text-base-content/70 hover:text-base-content'
							}`}
						>
							<MdWifi size={14} />
							Wi-Fi ({wifiCount})
						</button>
					</div>

					<button
						type="button"
						onClick={fetchNetworkInterfaces}
						disabled={loading}
						className="btn btn-xs btn-ghost rounded-lg text-base-content/60 hover:text-base-content"
						title="Refresh Adapters"
					>
						<MdRefresh size={16} className={loading ? 'animate-spin' : ''} />
					</button>
				</div>

				<div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
					{activeFilter === 'all' && (
						<div
							onClick={() => handleSelectInterface('Auto')}
							className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
								currentSelected === 'Auto'
									? 'bg-primary/10 border-primary shadow-sm'
									: 'bg-base-200 border-base-300 hover:border-primary/40 hover:bg-base-200/80'
							}`}
						>
							<div className="flex items-center gap-3">
								<div
									className={`p-2.5 rounded-xl ${
										currentSelected === 'Auto'
											? 'bg-primary text-primary-content'
											: 'bg-base-300 text-base-content/70'
									}`}
								>
									<TbNetwork size={20} />
								</div>
								<div>
									<div className="flex items-center gap-2">
										<h4 className="font-semibold text-sm text-base-content">
											Auto (Detect Active)
										</h4>
										<span className="badge badge-sm badge-ghost text-[10px] py-0.5">
											Recommended
										</span>
									</div>
									<p className="text-xs text-base-content/60 mt-0.5">
										Automatically applies DNS to the active gateway interface
									</p>
								</div>
							</div>

							{currentSelected === 'Auto' && (
								<MdCheckCircle className="text-primary text-xl shrink-0" />
							)}
						</div>
					)}

					{loading ? (
						<div className="py-8 flex flex-col items-center justify-center gap-2 text-base-content/60">
							<span className="loading loading-spinner loading-md text-primary"></span>
							<span className="text-xs">Scanning network interfaces...</span>
						</div>
					) : filteredInterfaces.length === 0 ? (
						<div className="py-6 text-center text-xs text-base-content/50 border border-dashed border-base-300 rounded-2xl">
							No {activeFilter === 'lan' ? 'LAN' : activeFilter === 'wifi' ? 'Wi-Fi' : ''} network adapters found
						</div>
					) : (
						filteredInterfaces.map((item) => {
							const isSelected = currentSelected === item.name
							const isWireless = item.type === 'Wireless'

							return (
								<div
									key={item.name}
									onClick={() => handleSelectInterface(item.name)}
									className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
										isSelected
											? 'bg-primary/10 border-primary shadow-sm'
											: 'bg-base-200 border-base-300 hover:border-primary/40 hover:bg-base-200/80'
									}`}
								>
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<div
											className={`p-2.5 rounded-xl shrink-0 ${
												isSelected
													? 'bg-primary text-primary-content'
													: 'bg-base-300 text-base-content/70'
											}`}
										>
											{isWireless ? <MdWifi size={20} /> : <MdLan size={20} />}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h4 className="font-semibold text-sm text-base-content truncate">
													{item.name}
												</h4>
												<span
													className={`badge badge-sm text-[10px] ${
														isWireless
															? 'badge-secondary badge-outline'
															: 'badge-info badge-outline'
													}`}
												>
													{isWireless ? 'Wi-Fi' : 'LAN'}
												</span>
												{item.gateway_ip && (
													<span className="badge badge-sm badge-success text-success-content text-[10px]">
														Connected
													</span>
												)}
											</div>

											<div className="flex flex-wrap items-center gap-x-3 text-[11px] text-base-content/60 mt-1 font-mono">
												{item.ip_address && (
													<span>IP: {item.ip_address}</span>
												)}
												{item.gateway_ip && (
													<span>Gateway: {item.gateway_ip}</span>
												)}
											</div>
										</div>
									</div>

									{isSelected && (
										<MdCheckCircle className="text-primary text-xl shrink-0 ml-2" />
									)}
								</div>
							)
						})
					)}
				</div>

				<Button
					className="w-full rounded-xl"
					onClick={() => props.setIsOpen(false)}
					size="sm"
				>
					Done
				</Button>
			</div>
		</Modal>
	)
}
