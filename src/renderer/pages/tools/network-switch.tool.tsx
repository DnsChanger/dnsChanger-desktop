import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdLan, MdWifi, MdRefresh } from 'react-icons/md'
import { TbNetwork } from 'react-icons/tb'
import { settingStore } from '../../app'
import { ToggleSwitch } from '../../component/toggle/toggle-switch.component'

interface NetworkInterfaceItem {
	name: string
	type: string
	ip_address?: string
	mac_address?: string
	gateway_ip?: string | null
	admin_state?: 'Enabled' | 'Disabled'
	connection_state?: 'Connected' | 'Disconnected'
}

export function NetworkSwitchTool() {
	const [interfaces, setInterfaces] = useState<NetworkInterfaceItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [switching, setSwitching] = useState<string | null>(null)
	const [activeDnsAdapter, setActiveDnsAdapter] = useState<string>(
		window.storePreload.get('settings')?.network_interface || 'Auto'
	)

	const fetchInterfaces = async () => {
		setLoading(true)
		try {
			const list: NetworkInterfaceItem[] = await window.os.getInterfaces()
			if (Array.isArray(list)) {
				setInterfaces(list)
			}
		} catch (err) {
			toast.error('Failed to retrieve network interfaces')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchInterfaces()
	}, [])

	const handleToggleInterface = async (name: string, currentEnabled: boolean) => {
		setSwitching(name)
		try {
			const res = await window.ipc.setInterfaceStatus(name, !currentEnabled)
			if (res?.success) {
				toast.success(`${name} ${!currentEnabled ? 'enabled' : 'disabled'}`)
				await fetchInterfaces()
			} else {
				toast.error(res?.message || `Failed to change ${name} state`)
			}
		} catch (err: any) {
			toast.error(err?.message || `Failed to change ${name} state`)
		} finally {
			setSwitching(null)
		}
	}

	const handleSetDnsTarget = (name: string) => {
		settingStore.network_interface = name
		window.ipc.saveSettings(settingStore).catch(() => {})
		setActiveDnsAdapter(name)
		toast.success(`DNS Target: ${name === 'Auto' ? 'Auto' : name}`)
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between px-1">
				<div className="flex items-center gap-1.5">
					<TbNetwork className="text-sm text-base-content/80" />
					<h3 className="text-xs font-semibold text-base-content">
						Network Adapters
					</h3>
					<span className="text-[11px] text-base-content/50">
						({interfaces.length})
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => handleSetDnsTarget('Auto')}
						className={`btn btn-xs h-6 min-h-6 px-2.5 rounded-lg text-[11px] font-medium transition-all ${
							activeDnsAdapter === 'Auto'
								? 'btn-primary shadow-xs'
								: 'bg-base-100 border border-base-300 text-base-content/70 hover:text-base-content hover:bg-base-200'
						}`}
					>
						Auto Detect
					</button>
					<button
						type="button"
						onClick={fetchInterfaces}
						disabled={loading}
						className="w-6 h-6 p-0 rounded-lg btn btn-ghost btn-xs min-h-6 text-base-content/60 hover:text-base-content hover:bg-base-100"
						title="Refresh"
					>
						<MdRefresh size={14} className={loading ? 'animate-spin' : ''} />
					</button>
				</div>
			</div>

			{loading ? (
				<div className="flex flex-col items-center justify-center gap-2 py-12 text-base-content/60">
					<span className="loading loading-spinner loading-md"></span>
					<span className="text-xs">Scanning network adapters...</span>
				</div>
			) : interfaces.length === 0 ? (
				<div className="py-8 text-xs text-center border border-dashed text-base-content/50 border-base-300 rounded-xl">
					No network interfaces found.
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2 max-h-[320px] pb-15 overflow-y-auto pr-1">
					{interfaces.map((item) => {
						const isWireless = item.type === 'Wireless'
						const isDnsTarget = activeDnsAdapter === item.name
						const isEnabled = item.admin_state
							? item.admin_state === 'Enabled'
							: !!item.gateway_ip || !!item.ip_address
						const isConnected =
							item.connection_state === 'Connected' || !!item.gateway_ip

						return (
							<div
								key={item.name}
								className={`p-2.5 rounded-xl border bg-base-100 transition-all flex flex-col justify-between gap-2 ${
									isDnsTarget
										? 'border-primary/60 shadow-xs'
										: !isEnabled
											? 'border-base-300 opacity-60'
											: 'border-base-300 hover:border-base-content/20'
								}`}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center min-w-0 gap-2">
										<div className="p-1.5 rounded-lg bg-base-200 text-base-content/70 shrink-0">
											{isWireless ? (
												<MdWifi size={15} />
											) : (
												<MdLan size={15} />
											)}
										</div>
										<div className="min-w-0">
											<h4
												className="text-xs font-semibold truncate text-base-content"
												title={item.name}
											>
												{item.name}
											</h4>
											<div className="flex items-center gap-1.5 mt-0.5">
												<span className="text-[10px] text-base-content/50">
													{isWireless ? 'Wi-Fi' : 'LAN'}
												</span>
												{!isEnabled ? (
													<span className="text-[10px] text-base-content/40">
														Disabled
													</span>
												) : isConnected ? (
													<span className="inline-flex items-center gap-0.5 text-[10px] text-success font-medium">
														<span className="w-1.5 h-1.5 rounded-full bg-success"></span>
														Connected
													</span>
												) : (
													<span className="text-[10px] text-base-content/40">
														Disconnected
													</span>
												)}
											</div>
										</div>
									</div>

									<ToggleSwitch
										enabled={isEnabled}
										loading={switching === item.name}
										onToggle={() =>
											handleToggleInterface(item.name, isEnabled)
										}
									/>
								</div>

								<div className="pt-1.5 border-t border-base-200 flex items-center justify-between gap-1 text-[10px]">
									<div className="min-w-0 font-mono truncate text-base-content/60">
										{item.ip_address
											? item.ip_address
											: isEnabled
												? 'No IP'
												: 'Disabled'}
									</div>

									{isDnsTarget ? (
										<span className="badge badge-sm badge-ghost text-[9px] h-4 py-0 px-1 text-primary border-primary/30 font-medium shrink-0">
											DNS Target
										</span>
									) : (
										<button
											type="button"
											disabled={!isEnabled}
											onClick={() => handleSetDnsTarget(item.name)}
											className="btn btn-ghost btn-xs h-5 min-h-5 px-1.5 text-[10px] font-normal text-base-content/60 hover:text-primary hover:bg-base-200 rounded-md shrink-0 disabled:opacity-30"
										>
											Set Target
										</button>
									)}
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
