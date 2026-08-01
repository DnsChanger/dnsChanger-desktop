import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ReactGA from 'react-ga4'
import { FiCopy, FiGlobe, FiMapPin, FiRefreshCw, FiServer } from 'react-icons/fi'
import { Button } from '../../component/button/button'

interface IpInfo {
	ip: string
	location?: {
		source?: string
		continent?: string
		continent_name?: string
		country?: string
		country_name?: string
		region?: string
		region_name?: string
		city?: string
		latitude?: number
		longitude?: number
		accuracy_radius?: number
		timezone?: {
			name?: string
		}
	}
	as?: {
		number?: number
		name?: string
	}
}

export function MyIpTool() {
	const [data, setData] = useState<IpInfo | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchIpInfo = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('https://ip.wtf/', {
				headers: {
					Accept: 'application/json',
				},
			})
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			const json: IpInfo = await res.json()
			setData(json)
			ReactGA.event({
				category: 'MyIpTool',
				action: 'FETCH_IP_SUCCESS',
			})
		} catch (err) {
			console.error(err)
			setError('Failed to fetch IP details')
			toast.error('Failed to fetch IP details')
			ReactGA.event({
				category: 'MyIpTool',
				action: 'FETCH_IP_ERROR',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchIpInfo()
	}, [])

	const handleCopyIp = () => {
		if (data?.ip) {
			navigator.clipboard.writeText(data.ip)
			toast.success('IP address copied!')
			ReactGA.event({
				category: 'MyIpTool',
				action: 'COPY_IP',
			})
		}
	}

	return (
		<div className="space-y-4">
			<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
				<div className="p-4 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FiGlobe className="text-primary text-lg" />
							<h3 className="font-semibold text-sm text-base-content">
								IP & Connection Info
							</h3>
						</div>
						<Button
							size="xs"
							onClick={fetchIpInfo}
							disabled={loading}
							className="rounded-xl btn-ghost gap-1 text-xs"
						>
							<FiRefreshCw
								size={12}
								className={loading ? 'animate-spin' : ''}
							/>
							<span>Refresh</span>
						</Button>
					</div>

					{loading ? (
						<div className="py-8 flex flex-col items-center justify-center gap-2 text-base-content/60">
							<span className="loading loading-spinner loading-md text-primary" />
							<span className="text-xs">Detecting IP address...</span>
						</div>
					) : error ? (
						<div className="py-6 flex flex-col items-center justify-center gap-3 text-error">
							<span className="text-xs">{error}</span>
							<Button
								size="xs"
								onClick={fetchIpInfo}
								className="rounded-xl btn-outline btn-error"
							>
								Try Again
							</Button>
						</div>
					) : data ? (
						<div className="flex flex-col gap-3.5">
							<div className="flex items-center justify-between p-3.5 rounded-xl bg-base-200 border border-base-300">
								<div>
									<span className="text-[11px] font-medium text-base-content/60 block">
										Public IP Address
									</span>
									<span className="text-base font-bold text-base-content font-mono tracking-tight">
										{data.ip}
									</span>
								</div>
								<button
									type="button"
									onClick={handleCopyIp}
									className="btn btn-sm btn-square btn-ghost rounded-xl text-base-content/70 hover:text-primary transition-colors"
									title="Copy IP"
								>
									<FiCopy size={15} />
								</button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<div className="p-3 rounded-xl bg-base-200/60 border border-base-300 flex flex-col gap-1.5">
									<div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
										<FiMapPin className="text-primary" size={14} />
										<span>Location</span>
									</div>
									<div className="text-xs space-y-1 text-base-content/70">
										<div className="flex justify-between">
											<span>Country:</span>
											<span className="font-medium text-base-content">
												{data.location?.country_name || 'N/A'}{' '}
												{data.location?.country
													? `(${data.location.country})`
													: ''}
											</span>
										</div>
										<div className="flex justify-between">
											<span>City / Region:</span>
											<span className="font-medium text-base-content">
												{[
													data.location?.city,
													data.location?.region_name,
												]
													.filter(Boolean)
													.join(', ') || 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Continent:</span>
											<span className="font-medium text-base-content">
												{data.location?.continent_name || 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Timezone:</span>
											<span className="font-medium text-base-content">
												{data.location?.timezone?.name || 'N/A'}
											</span>
										</div>
									</div>
								</div>

								<div className="p-3 rounded-xl bg-base-200/60 border border-base-300 flex flex-col gap-1.5">
									<div className="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
										<FiServer className="text-primary" size={14} />
										<span>Network & ISP</span>
									</div>
									<div className="text-xs space-y-1 text-base-content/70">
										<div className="flex justify-between">
											<span>ASN:</span>
											<span className="font-medium text-base-content font-mono">
												{data.as?.number
													? `AS${data.as.number}`
													: 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>ISP / Provider:</span>
											<span className="font-medium text-base-content text-right truncate max-w-[140px]">
												{data.as?.name || 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Coordinates:</span>
											<span className="font-medium text-base-content font-mono">
												{data.location?.latitude &&
												data.location?.longitude
													? `${data.location.latitude}, ${data.location.longitude}`
													: 'N/A'}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Data Source:</span>
											<span className="font-medium text-base-content">
												{data.location?.source || 'N/A'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
