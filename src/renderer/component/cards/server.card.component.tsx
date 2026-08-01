import { useEffect, useState } from 'react'
import {
	IoAddCircleOutline,
	IoCheckmarkCircleOutline,
	IoRemoveCircleOutline,
} from 'react-icons/io5'
import { FiCopy } from 'react-icons/fi'
import { CiCircleMore } from 'react-icons/ci'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

import type { Server } from '../../../shared/interfaces/server.interface'
import { getPingIcon } from '../../utils/icons.util'

export interface ServerCardProps {
	server: Server
	storeServers: Server[]
	setStoreServers: React.Dispatch<React.SetStateAction<Server[]>>
}

export function ServerCardComponent({
	server,
	storeServers,
	setStoreServers,
}: ServerCardProps) {
	const { avatar, name, key, tags, servers, rate, ping } = server

	const [menuOpen, setMenuOpen] = useState(false)
	const [actionLoading, setActionLoading] = useState(false)
	const [actionError, setActionError] = useState(false)
	const [copied, setCopied] = useState(false)

	const isInstalled = storeServers.some((item) => item.key === key)

	useEffect(() => {
		if (!menuOpen) return

		function handleKey(e: KeyboardEvent) {
			if (e.key === 'Escape') setMenuOpen(false)
		}

		window.addEventListener('keydown', handleKey)
		return () => window.removeEventListener('keydown', handleKey)
	}, [menuOpen])

	async function addHandler() {
		setActionLoading(true)
		setActionError(false)

		try {
			const response = await window.ipc.addDns(server)
			if (response.success) {
				setStoreServers(response.servers || [])
			} else {
				setActionError(true)
			}
		} catch {
			setActionError(true)
		} finally {
			setActionLoading(false)
		}
	}

	async function deleteHandler() {
		setActionLoading(true)
		setActionError(false)

		try {
			const response = await window.ipc.deleteDns(server)
			if (response.success) {
				setStoreServers(response.servers || [])
			} else {
				setActionError(true)
			}
		} catch {
			setActionError(true)
		} finally {
			setActionLoading(false)
		}
	}

	function copyHandler() {
		navigator.clipboard.writeText(servers.join(', '))
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	function renderRating(value: number) {
		const rating = value / 2
		const full = Math.floor(rating)
		const half = rating - full >= 0.5
		const stars = []

		for (let i = 0; i < 5; i++) {
			if (i < full) {
				stars.push(<FaStar key={i} className="text-warning" size={11} />)
			} else if (i === full && half) {
				stars.push(<FaStarHalfAlt key={i} className="text-warning" size={11} />)
			} else {
				stars.push(<FaRegStar key={i} className="text-base-300" size={11} />)
			}
		}
		return stars
	}

	return (
		<div className="relative transition-all duration-200 border rounded-2xl bg-base-100 border-base-300 hover:border-primary/40 hover:shadow-md">
			<div className="p-3.5">
				<div className="flex items-center gap-3">
					<div className="shrink-0">
						<div className="w-11 h-11 overflow-hidden rounded-xl bg-base-200 border border-base-300 flex items-center justify-center">
							<img
								src={`./servers-icon/${avatar}`}
								alt={name}
								className="object-cover w-full h-full"
								onError={({ currentTarget }) => {
									currentTarget.onerror = null
									currentTarget.src = './servers-icon/def.png'
								}}
							/>
						</div>
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h3 className="text-sm font-semibold truncate text-base-content">
								{name}
							</h3>

							<div className="flex flex-wrap gap-1 shrink-0">
								{tags.slice(0, 3).map((tag: string) => (
									<span
										key={tag}
										className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-base-200 border border-base-300/60 text-base-content/70 whitespace-nowrap"
									>
										{tag}
									</span>
								))}
								{tags.length > 3 && (
									<span className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-base-200 border border-base-300/60 text-base-content/50">
										+{tags.length - 3}
									</span>
								)}
							</div>

							<div className="flex items-center gap-1 ml-auto shrink-0">
								<span className="shrink-0">{getPingIcon(ping)}</span>
								<span className="text-xs text-base-content/60 font-mono">
									{ping === -1 ? 'N/A' : `${ping}ms`}
								</span>
							</div>

							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className="p-1.5 transition-colors rounded-lg shrink-0 text-base-content/50 hover:bg-base-200 hover:text-base-content cursor-pointer"
								aria-label="More options"
							>
								<CiCircleMore size={18} />
							</button>
						</div>

						<div className="flex items-center justify-between mt-2 pt-2 border-t border-base-300/70">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									{renderRating(rate)}
								</div>
								{actionError && (
									<span className="text-[10px] text-error">
										Failed to complete operation.
									</span>
								)}
							</div>

							<button
								onClick={isInstalled ? deleteHandler : addHandler}
								disabled={actionLoading}
								className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer duration-200 disabled:opacity-50 ${
									isInstalled
										? 'btn-error btn-outline btn-xs hover:bg-error hover:text-error-content hover:border-error hover:scale-[1.03] active:scale-[0.97] hover:shadow-sm'
										: 'btn-primary btn-xs hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] hover:shadow-md'
								}`}
							>
								{actionLoading ? (
									<span className="loading loading-spinner loading-xs" />
								) : isInstalled ? (
									<IoRemoveCircleOutline size={14} />
								) : (
									<IoAddCircleOutline size={14} />
								)}
								{isInstalled ? 'Remove' : 'Add'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Dropdown Menu */}
			{menuOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setMenuOpen(false)}
					/>
					<div className="absolute z-20 w-64 p-2 border shadow-xl right-3 top-12 rounded-2xl bg-base-100 border-base-300">
						{/* Copy DNS */}
						<button
							onClick={copyHandler}
							className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium transition-colors rounded-xl text-base-content hover:bg-base-200"
						>
							{copied ? (
								<IoCheckmarkCircleOutline
									size={15}
									className="shrink-0 text-success"
								/>
							) : (
								<FiCopy
									size={15}
									className="shrink-0 text-base-content/70"
								/>
							)}
							<span>
								{copied ? 'Copied to clipboard!' : 'Copy DNS Addresses'}
							</span>
						</button>

						{/* DNS Servers List */}
						<div className="px-3 py-2 mt-1.5 rounded-xl bg-base-200/80 border border-base-300/40">
							<div className="text-[10px] font-semibold uppercase text-base-content/50">
								DNS Servers
							</div>
							<div className="mt-1 space-y-0.5">
								{servers.map((address: string) => (
									<div
										key={address}
										className="font-mono text-xs truncate text-base-content/80"
									>
										{address}
									</div>
								))}
							</div>
						</div>

						{/* Rating */}
						<div className="flex items-center justify-between px-3 py-1.5 mt-1">
							<span className="text-xs font-medium text-base-content/60">
								Rating
							</span>
							<div className="flex items-center gap-1.5">
								<div className="flex items-center gap-0.5">
									{renderRating(rate)}
								</div>
								<span className="text-xs font-mono text-base-content/60">
									{(rate / 2).toFixed(1)}
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export { ServerCardComponent as ServerCard }
