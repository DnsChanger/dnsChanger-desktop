import { Chip } from '@material-tailwind/react'
import { useContext, useEffect, useState } from 'react'
import { Avatar, Button } from 'react-daisyui'
import { FiCopy } from 'react-icons/fi'
import { TfiReload } from 'react-icons/tfi'
import icon from '../../../../../public/icons/icon.png'
import { useI18nContext } from '../../../../i18n/i18n-react'
import { serversContext } from '../../../context/servers.context'
import { getPingIcon } from '../../../utils/icons.util'
import { DeleteButtonComponent } from '../../buttons/delete-btn.component'
import { ToggleButtonComponent } from '../../buttons/togglePin-btn.component'
interface Prop {
	loadingCurrentActive: boolean
}

const ServerCardWrapper = ({ children }) => {
	return (
		<div className="dark:bg-[#262626] bg-base-200 w-full mt-1 rounded-2xl shadow-md overflow-hidden h-52 min-h-52 max-h-52">
			{children}
		</div>
	)
}

export function ServerInfoCardComponent(prop: Prop) {
	const serversStateContext = useContext(serversContext)
	const [isCopyAdds, setIsCopyAdds] = useState<boolean>(true)
	const [ping, setPing] = useState<number>()
	const { LL } = useI18nContext()

	useEffect(() => {
		if (isCopyAdds) {
			setTimeout(() => {
				setIsCopyAdds(false)
			}, 700)
		}
	}, [isCopyAdds])

	useEffect(() => {
		if (serversStateContext.selected) getPing()
	}, [serversStateContext.selected, serversStateContext.currentActive])

	function getPing() {
		setPing(0)
		window.ipc
			.ping(serversStateContext.selected)
			.then((res) => res.success && setPing(res.data.time))
	}
	if (!serversStateContext.selected) {
		return (
			<ServerCardWrapper>
				<div className={'flex flex-col gap-2 justify-center h-full'}>
					<div className={'flex flex-row gap-2 items-center justify-center'}>
						<Avatar src={icon} size={'xs'} className={'mb-2'} />
						<h1 className={'text-2xl font-[balooTamma] text-[#7487FF]'}>
							{LL.pages.home.homeTitle()}
						</h1>
					</div>
					{prop.loadingCurrentActive && (
						<div className={'flex flex-row gap-2 items-center justify-center'}>
							<span className="loading loading-ring loading-xs"></span>
							<span className={'text-[#7B7B7B]'}>
								Fetching current active...
							</span>
						</div>
					)}
					<span className={'text-[#787878] text-sm text-center'}>
						{LL.version()} {import.meta.env.PACKAGE_VERSION}
					</span>
				</div>
			</ServerCardWrapper>
		)
	}
	const isConnect =
		serversStateContext.currentActive?.key == serversStateContext.selected.key
	const name =
		serversStateContext.selected.name?.length > 14
			? `${serversStateContext.selected.name.slice(0, 12)}...`
			: serversStateContext.selected.name
	const network =
		serversStateContext.network?.length > 14
			? `${serversStateContext.network.slice(0, 12)}...`
			: serversStateContext.network

	return (
		<ServerCardWrapper>
			<div className="flex items-center justify-between px-3 py-1 border-b border-gray-200 dark:border-gray-700/50">
				<div className="flex items-center space-x-2">
					<div className="p-2 bg-gray-200 rounded-full dark:bg-gray-800/20">
						<img
							src={`./servers-icon/${serversStateContext.selected.avatar}`}
							alt=""
							className="w-6 h-6 rounded-full"
							onError={({ currentTarget }) => {
								currentTarget.onerror = null
								currentTarget.src = './servers-icon/def.png'
							}}
						/>
					</div>
					<div className="flex flex-col gap-0.5">
						<h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
							{name || 'Unknown'}
						</h2>
						<span className="text-xs text-gray-500">DNS Server</span>
					</div>
				</div>

				{/* Connection Status */}
				<div
					className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-[balooTamma] ${isConnect ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-red-100 text-red-600 dark:bg-red-900/20'}`}
				>
					<span
						className={`block w-2 h-2 rounded-full ${isConnect ? 'bg-green-600' : 'bg-red-600'}`}
					></span>
					{isConnect ? 'Connected' : 'Disconnected'}
				</div>
			</div>

			{/* Server Details Section */}
			<div className="p-1">
				<div className="grid w-full grid-cols-1 gap-4">
					<div className="w-full px-3 py-2 rounded-lg">
						<div className="flex items-center justify-between mb-1">
							<h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
								{window.os.os === 'win32' ? 'Network' : 'Performance'}
							</h3>
							<button
								onClick={getPing}
								className="flex items-center gap-1 p-1 text-gray-600 rounded-full hover:text-gray-900 hover:bg-gray-300 dark:hover:text-gray-300 dark:hover:bg-gray-700"
							>
								<TfiReload size={14} />
							</button>
						</div>

						<div className="flex flex-col space-y-2">
							{window.os.os === 'win32' && (
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500">Interface:</span>
									<span className="text-sm font-medium text-gray-800 dark:text-gray-200/70 bg-gray-300 dark:bg-gray-800/50 px-2 py-0.5 rounded">
										{network}
									</span>
								</div>
							)}

							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-500">Ping:</span>
								<div className="flex items-center">
									{ping > 0 && getPingIcon(ping)}
									<span className="ml-1 text-sm font-medium text-gray-800 dark:text-gray-200/70">
										{ping ? `${ping}ms` : 'Testing...'}
									</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-xs text-gray-500">DNS Address:</span>
								<div className="flex items-center">
									{isCopyAdds ? (
										<span className="text-xs font-medium text-green-500">
											Copied!
										</span>
									) : (
										<button
											onClick={() => {
												navigator.clipboard.writeText(
													serversStateContext.selected.servers.join(','),
												)
												setIsCopyAdds(true)
											}}
											className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
										>
											<FiCopy size={14} />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<DeleteButtonComponent />
						<ToggleButtonComponent />
					</div>
				</div>
			</div>
		</ServerCardWrapper>
	)
}
