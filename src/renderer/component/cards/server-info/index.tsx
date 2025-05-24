import { Chip } from '@material-tailwind/react'
import { useContext, useEffect, useState } from 'react'
import { Avatar, Button } from 'react-daisyui'
import { FiCopy } from 'react-icons/fi'
import { TfiReload } from 'react-icons/tfi'
import icon from '../../../../../public/icons/icon.png'
import { useI18nContext } from '../../../../i18n/i18n-react'
import { serversContext } from '../../../context/servers.context'
import { getPingIcon } from '../../../utils/icons.util'
interface Prop {
	loadingCurrentActive: boolean
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
			<div
				className={
					'dark:bg-[#262626] bg-base-200 h-[189px] w-[362px] mt-5 rounded-[23px] flex items-center justify-center'
				}
			>
				<div className={'flex flex-col gap-2 p-4'}>
					<div className={'flex flex-row gap-2 items-center justify-center'}>
						<Avatar src={icon} size={'xs'} className={'mb-2'} />
						<h1 className={'text-2xl font-[balooTamma] text-[#7487FF]'}>
							{LL.pages.home.homeTitle()}
						</h1>
					</div>
					<hr className={'border-t-2 border-[#A8A8A8] dark:border-[#323232]'} />
					<div className={'flex flex-row gap-2 justify-center'}>
						{prop.loadingCurrentActive ? (
							<div className={'flex flex-row gap-2 items-center'}>
								<span className="loading loading-ring loading-xs"></span>
								<span className={'text-[#7B7B7B]'}>
									Fetching current active...
								</span>
							</div>
						) : (
							<span></span>
						)}
					</div>
					<span className={'text-[#787878] text-sm text-center'}>
						{LL.version()} {import.meta.env.PACKAGE_VERSION}
					</span>
				</div>
			</div>
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
		<div className="dark:bg-[#262626] bg-base-200 h-[189px] w-full mt-5 rounded-[23px] p-4">
			<div
				className={'grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400'}
			>
				<div className={'flex flex-col gap-2'}>
					<h3 className={'font-semibold text-gray-500'}>Name</h3>

					<div className={'w-full flex flex-row gap-2 justify-center'}>
						<div className="flex items-center gap-3 p-2 bg-gray-300 rounded-lg dark:bg-gray-900">
							<img
								src={`./servers-icon/${serversStateContext.selected.avatar}`}
								alt=""
								className="w-5 h-5 rounded-full"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null // prevents looping
									currentTarget.src = './servers-icon/def.png'
								}}
							/>
							<span className="text-sm font-medium text-slate-900 dark:text-slate-200">
								{name || 'Unknown'}
							</span>
						</div>
					</div>
				</div>{' '}
				<div className={'flex flex-col gap-2 items-center justify-center'}>
					<h3 className={'font-semibold text-gray-500'}>Ping</h3>

					<div className={'w-full flex justify-center'}>
						<Button
							color="ghost"
							size="sm"
							className="flex items-center gap-2 transition-colors bg-gray-300 border-gray-300 dark:border-gray-900 dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-400"
							onClick={getPing}
						>
							{ping > 0 && getPingIcon(ping)}
							<span className="text-sm font-medium text-slate-900 dark:text-slate-200">
								{ping}
							</span>
							<TfiReload />
						</Button>
					</div>
				</div>{' '}
				<div className={'flex flex-col gap-2 items-center justify-center'}>
					<h3 className={'font-semibold text-gray-500'}>Address</h3>
					<div className={'w-full flex justify-center'}>
						{isCopyAdds ? (
							<Button color="success" size="sm" className="flex items-center">
								<span className="text-sm font-medium normal-case">Copied!</span>
							</Button>
						) : (
							<Button
								color="ghost"
								size="sm"
								className="flex items-center gap-2 transition-colors bg-gray-300 border-gray-300 dark:border-gray-900 dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-400"
								onClick={() => {
									navigator.clipboard.writeText(
										serversStateContext.selected.servers.join(','),
									)
									setIsCopyAdds(true)
								}}
							>
								{' '}
								<span className="text-sm font-medium text-slate-900 dark:text-slate-200">
									{`${serversStateContext.selected.servers[0].slice(0, 10)}...`}
								</span>
								<FiCopy />
							</Button>
						)}
					</div>
				</div>{' '}
				<div className={'flex flex-col gap-2 items-center justify-center'}>
					{window.os.os == 'win32' ? (
						<>
							<h3 className={'font-semibold text-gray-500'}>Network</h3>

							<div className={'w-full flex justify-center'}>
								{
									<Chip
										variant="ghost"
										color={isConnect ? 'green' : 'red'}
										size="sm"
										value={network}
										className={`${isConnect ? 'text-green-600' : 'text-red-600'}`}
										icon={
											<span
												className={`content-[''] block w-2 h-2 rounded-full mx-auto mt-1 ${
													isConnect ? 'bg-green-900' : 'bg-red-900'
												}`}
											/>
										}
									/>
								}
							</div>
						</>
					) : (
						<>
							<h3 className={'font-semibold text-gray-500'}>Status</h3>

							<div className={'w-full flex justify-center'}>
								{
									<Chip
										variant="ghost"
										color={isConnect ? 'green' : 'red'}
										size="sm"
										value={isConnect ? 'Connected' : 'Disconnected'}
										className={`${isConnect ? 'text-green-600' : 'text-red-600'}`}
										icon={
											<span
												className={`content-[''] block w-2 h-2 rounded-full mx-auto mt-1 ${
													isConnect ? 'bg-green-900' : 'bg-red-900'
												}`}
											/>
										}
									/>
								}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
