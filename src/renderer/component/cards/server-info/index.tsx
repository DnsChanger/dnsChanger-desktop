import { useContext, useEffect, useState } from 'react'
import { FiCopy } from 'react-icons/fi'
import { TfiReload } from 'react-icons/tfi'

import icon from '../../../../../public/icons/icon.png'

import { useI18nContext } from '../../../../i18n/i18n-react'
import { serversContext } from '../../../context/servers.context'
import { getPingIcon } from '../../../utils/icons.util'
import { cn } from '../../../utils/cn'

import { DeleteButtonComponent } from '../../buttons/delete-btn.component'
import { ToggleButtonComponent } from '../../buttons/togglePin-btn.component'

interface Prop {
	loadingCurrentActive: boolean
}

function ServerCardWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="w-full overflow-hidden shadow-lg h-52 rounded-2xl bg-base-200">
			{children}
		</div>
	)
}

function InfoTile({
	title,
	children,
	action,
}: {
	title: string
	children: React.ReactNode
	action?: React.ReactNode
}) {
	return (
		<div className="p-3 transition-colors rounded-xl bg-base-300/40">
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs tracking-wide uppercase text-base-content/50">
					{title}
				</span>

				{action}
			</div>

			<div>{children}</div>
		</div>
	)
}

export function ServerInfoCardComponent({ loadingCurrentActive }: Prop) {
	const servers = useContext(serversContext)

	const { LL } = useI18nContext()

	const [ping, setPing] = useState<number>()

	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return

		const timer = setTimeout(() => {
			setCopied(false)
		}, 1000)

		return () => clearTimeout(timer)
	}, [copied])

	useEffect(() => {
		if (servers.selected) {
			refreshPing()
		}
	}, [servers.selected, servers.currentActive])

	function refreshPing() {
		if (!servers.selected) return

		setPing(undefined)

		window.ipc.ping(servers.selected).then((res) => {
			if (res.success) {
				setPing(res.data.time || -1)
			}
		})
	}

	if (!servers.selected) {
		return (
			<ServerCardWrapper>
				<div className="flex flex-col items-center justify-center h-full gap-4">
					<div className="flex items-center gap-3">
						<img src={icon} alt="" className="w-14 h-14 avatar" />

						<div>
							<h2 className="font-[balooTamma] text-2xl text-primary">
								{LL.pages.home.homeTitle()}
							</h2>

							<p className="text-xs text-base-content/60">
								{LL.version()} {import.meta.env.PACKAGE_VERSION}
							</p>
						</div>
					</div>

					{loadingCurrentActive && (
						<div className="flex items-center gap-2 text-base-content/60">
							<span className="loading loading-ring loading-sm"></span>

							<span className="text-sm">Fetching current active...</span>
						</div>
					)}
				</div>
			</ServerCardWrapper>
		)
	}

	const isConnected = servers.currentActive?.key === servers.selected.key

	const name =
		servers.selected.name.length > 18
			? `${servers.selected.name.slice(0, 18)}...`
			: servers.selected.name

	const network =
		servers.network && servers.network.length > 18
			? `${servers.network.slice(0, 18)}...`
			: servers.network

	return (
		<ServerCardWrapper>
			<div className="flex flex-col h-full p-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-base-300">
							<img
								src={`./servers-icon/${servers.selected.avatar}`}
								className="w-8 h-8 rounded-full"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null
									currentTarget.src = './servers-icon/def.png'
								}}
							/>
						</div>

						<div>
							<div className="flex gap-0.5">
								<p className="font-semibold text-base-content">{name}</p>
							</div>

							<p className="text-xs text-base-content/50">
								{servers.selected.protocol === 'doh'
									? 'DNS-over-HTTPS'
									: servers.selected.protocol === 'dot'
										? 'DNS-over-TLS'
										: 'Public DNS Server'}
							</p>
						</div>
					</div>

					<div
						className={cn(
							'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
							isConnected
								? 'bg-success/15 text-success'
								: 'bg-error/15 text-error'
						)}
					>
						<div
							className={cn(
								'h-2 w-2 rounded-full',
								isConnected ? 'bg-success' : 'bg-error'
							)}
						/>

						{isConnected ? 'Connected' : 'Disconnected'}
					</div>
				</div>
				{/* Stats */}
				<div className="grid grid-cols-3 gap-3 mt-4">
					<InfoTile title={window.os.os === 'win32' ? 'Network' : 'Status'}>
						<div className="text-sm font-medium truncate text-base-content">
							{window.os.os === 'win32' ? network : 'Ready'}
						</div>
					</InfoTile>

					<InfoTile
						title="Ping"
						action={
							<button
								onClick={refreshPing}
								className="p-1 transition-colors rounded cursor-pointer hover:bg-base-300/60"
							>
								<TfiReload size={12} />
							</button>
						}
					>
						<div className="flex items-center gap-2 truncate">
							{ping && getPingIcon(ping)}

							<span className="text-sm font-medium">
								{ping ? `${ping || -1} ms` : 'Testing...'}
							</span>
						</div>
					</InfoTile>

					<InfoTile
						title={
							servers.selected.protocol === 'doh'
								? 'DoH'
								: servers.selected.protocol === 'dot'
									? 'DoT'
									: 'DNS'
						}
						action={
							copied ? (
								<span className="text-xs text-success">Copied</span>
							) : (
								<button
									onClick={() => {
										const text =
											servers.selected?.protocol === 'doh'
												? servers.selected.dohUrl || ''
												: servers.selected?.protocol === 'dot'
													? servers.selected.dotHost || ''
													: servers.selected?.servers?.join(
															', '
														) || ''

										navigator.clipboard.writeText(text)
										setCopied(true)
									}}
									className="p-1 transition-colors rounded cursor-pointer hover:bg-base-300/60"
								>
									<FiCopy size={13} />
								</button>
							)
						}
					>
						<div className="text-sm font-medium truncate">
							{servers.selected.protocol === 'doh'
								? servers.selected.dohUrl
								: servers.selected.protocol === 'dot'
									? servers.selected.dotHost
									: servers.selected.servers[0]}
						</div>
					</InfoTile>
				</div>

				<div className="flex items-center justify-between pt-3 mt-auto text-xs text-base-content/40">
					<span>
						{servers.selected.protocol === 'doh'
							? 'DoH Server'
							: servers.selected.protocol === 'dot'
								? 'DoT Server'
								: (servers.selected.type ?? 'DNS Server')}
					</span>
					<div className="flex items-center gap-1">
						<DeleteButtonComponent />
						<ToggleButtonComponent />
					</div>
				</div>
			</div>
		</ServerCardWrapper>
	)
}
