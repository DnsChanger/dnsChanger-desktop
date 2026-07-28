import { useContext, useMemo, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { CiPower } from 'react-icons/ci'

import { serversContext } from '../../context/servers.context'
import { appNotif } from '../../notifications/appNotif'
import { trackEvent } from '../../utils/analytics.util'
import { cn } from '../../utils/cn'

export function ConnectButtonComponent() {
	const servers = useContext(serversContext)

	const [loading, setLoading] = useState(false)

	const isConnected = useMemo(
		() =>
			!!servers.currentActive &&
			servers.currentActive.key === servers.selected?.key,
		[servers.currentActive, servers.selected]
	)

	const statusText = loading
		? isConnected
			? 'Disconnecting...'
			: 'Connecting...'
		: isConnected
			? 'Connected'
			: 'Disconnected'

	async function handleClick() {
		if (loading) return

		if (!servers.selected) {
			appNotif('Error', 'Please select a server first.')
			return
		}

		setLoading(true)

		try {
			if (isConnected) {
				const response = await window.ipc.clearDns()

				if (!response.success) {
					window.ipc.dialogError('Error', response.message)
					return
				}

				servers.setCurrentActive(null)
				window.ipc.notif(response.message)
			} else {
				const response = await window.ipc.setDns(servers.selected)

				if (!response.success) {
					window.ipc.dialogError('Error', response.message)
					return
				}

				servers.setCurrentActive(servers.selected)
				window.ipc.notif(response.message)

				trackEvent({
					category: 'User',
					action: 'CONNECTED',
					label: servers.selected.name,
					value: 1,
				})
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center pt-10 text-center">
			<button
				type="button"
				onClick={handleClick}
				disabled={loading}
				aria-label={statusText}
				className={cn(
					'flex h-32 cursor-pointer w-32 items-center justify-center rounded-full  outline-8 -outline-offset-2 transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed',
					loading &&
						'cursor-wait bg-base-100 text-base-content outline-base-300/40',
					!loading &&
						isConnected &&
						'bg-success/80 text-success-content outline-success/20 hover:bg-success/90 shadow-lg shadow-success/20',
					!loading &&
						!isConnected &&
						'bg-base-100 text-base-content outline-base-300/40 hover:bg-base-200 shadow-lg shadow-base-300/20'
				)}
			>
				{loading ? (
					<AiOutlineLoading size={60} className="animate-spin" />
				) : (
					<CiPower
						size={60}
						className={cn(
							'transition-transform duration-300',
							!isConnected && 'rotate-180'
						)}
					/>
				)}
			</button>

			<p className="mt-5 w-42 min-w-42 truncate  font-[balooTamma] text-2xl text-base-content/70">
				{statusText}
			</p>
		</div>
	)
}
