import axios from 'axios'
import { useEffect, useState } from 'react'
import { UrlsConstant } from '../../../shared/constants/urls.constant'
import { Advertisement } from '../../../shared/interfaces/advertisement.interface'

export function AdvertisementCardComponent() {
	const [ad, setAd] = useState<Advertisement | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<boolean>(false)
	useEffect(() => {
		async function fetchAd() {
			try {
				setLoading(true)
				setError(false)
				const response = await axios.get<Advertisement>(
					`${UrlsConstant.ADS_STORE}?t=${Date.now()}`,
				)
				if (!response.data || response.data.disabled) {
					setAd(null)
					setError(true)
				} else {
					setAd(response.data)
				}
			} catch (err) {
				console.error('Failed to load advertisement:', err)
				setError(true)
			} finally {
				setLoading(false)
			}
		}

		fetchAd()
	}, [])

	function handleAdClick() {
		if (ad?.url) {
			window.ipc.openBrowser(ad.url)
		} else {
			window.ipc.openBrowser('https://discord.gg/p9TZzEV39e')
		}
	}

	if (loading) {
		return (
			<div
				className={
					'p-2 dark:bg-[#262626] bg-base-200 rounded-2xl shadow-sm h-[70px] max-h-[70px] flex items-center justify-center'
				}
			>
				<div className="flex flex-row items-center gap-2">
					<span className="loading loading-ring loading-xs"></span>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						Loading advertisement...
					</span>
				</div>
			</div>
		)
	}
	if (error || !ad) {
		return (
			<div
				className={
					'p-2 dark:bg-[#262626] bg-base-200 rounded-2xl shadow-sm h-[70px] max-h-[70px] flex items-center justify-center overflow-hidden cursor-pointer'
				}
				onClick={handleAdClick}
			>
				<div className="text-sm font-medium text-gray-400 dark:text-gray-500">
					Ad
				</div>
			</div>
		)
	}
	return (
		<div
			className={
				'p-1 dark:bg-[#262626] bg-base-200 rounded-2xl shadow-sm h-[70px] max-h-[70px] overflow-hidden cursor-pointer w-[360px] max-w-[360px] relative'
			}
			onClick={handleAdClick}
		>
			<div className="flex items-center h-full">
				<img
					src={ad.banner}
					alt={ad.name}
					className="object-cover w-full h-full rounded-xl"
					onError={({ currentTarget }) => {
						currentTarget.onerror = null
						currentTarget.style.display = 'none'
						setError(true)
					}}
				/>
			</div>
			<div className="absolute top-0 right-0 bg-gray-500/30 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg font-medium">
				Ad
			</div>
		</div>
	)
}
