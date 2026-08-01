import { useContext, useMemo, useState } from 'react'
import { IoFlash, IoPlay } from 'react-icons/io5'
import { MdCheckCircle } from 'react-icons/md'

import type { setState } from '../../interfaces/react.interface'
import type { Server } from '../../../shared/interfaces/server.interface'
import type { DnsBenchmarkResult } from '../../../shared/interfaces/dns-benchmark.interface'
import {
	CUSTOM_BENCHMARK_TARGET_KEY,
	benchmarkTargets,
} from '../../../shared/constants/benchmark-targets.constant'

import { getPingIcon } from '../../utils/icons.util'
import { appNotif } from '../../notifications/appNotif'
import { serversContext } from '../../context/servers.context'

import Modal from './modal'
import { Button } from '../button/button'
import { TextInput } from '../input/text-input'

interface Props {
	isOpen: boolean
	setIsOpen: setState<boolean>
	servers: Server[]
}

const statusStyles: Record<DnsBenchmarkResult['status'], string> = {
	ok: 'bg-success/15 text-success',
	blocked: 'bg-error/15 text-error',
	error: 'bg-error/15 text-error',
	failed: 'bg-base-300 text-base-content/50',
}

const statusLabels: Record<DnsBenchmarkResult['status'], string> = {
	ok: 'Reachable',
	blocked: 'Blocked (403)',
	error: 'Error',
	failed: 'Failed',
}

export function DnsBenchmarkModalComponent(props: Props) {
	const { setSelected } = useContext(serversContext)
	const [targetKey, setTargetKey] = useState<string>(benchmarkTargets[0].key)
	const [customUrl, setCustomUrl] = useState<string>('')
	const [isTesting, setIsTesting] = useState<boolean>(false)
	const [results, setResults] = useState<DnsBenchmarkResult[] | null>(null)

	const selectedTarget = useMemo(
		() => benchmarkTargets.find((target) => target.key === targetKey),
		[targetKey]
	)

	const isCustomTarget = targetKey === CUSTOM_BENCHMARK_TARGET_KEY
	const targetUrl = isCustomTarget ? customUrl.trim() : selectedTarget?.url || ''

	const sortedResults = useMemo(() => {
		if (!results) return null
		return [...results].sort((a, b) => {
			if (a.status === 'ok' && b.status !== 'ok') return -1
			if (a.status !== 'ok' && b.status === 'ok') return 1
			if (a.ping === -1) return 1
			if (b.ping === -1) return -1
			return a.ping - b.ping
		})
	}, [results])

	const bestServerResult = useMemo(() => {
		if (!sortedResults || sortedResults.length === 0) return null
		const top = sortedResults[0]
		return top.status === 'ok' && top.ping > 0 ? top : null
	}, [sortedResults])

	function handleClose() {
		if (isTesting) return
		props.setIsOpen(false)
	}

	async function startTest() {
		if (!props.servers.length) {
			appNotif('Error', 'No DNS servers to test', 'ERROR')
			return
		}

		if (!targetUrl) {
			appNotif('Error', 'Please enter a target website', 'ERROR')
			return
		}

		setIsTesting(true)
		setResults(null)

		try {
			const response = await window.ipc.benchmarkDns(targetUrl, props.servers)

			if (response.success) {
				setResults(response.results)
			} else {
				appNotif('Error', response.message || 'Test failed', 'ERROR')
			}
		} catch {
			appNotif('Error', 'Unknown error while testing DNS servers', 'ERROR')
		} finally {
			setIsTesting(false)
		}
	}

	function selectServer(result: DnsBenchmarkResult) {
		const server = props.servers.find((item) => item.key === result.key)
		if (!server) return

		if (setSelected) {
			setSelected(server as any)
		}

		appNotif('Selected', `${server.name} selected`, 'SUCCESS')
		props.setIsOpen(false)
	}

	if (!props.isOpen) return null

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={handleClose}
			title="Find Best DNS Server"
			size="lg"
		>
			<div className="flex flex-col justify-between gap-3.5 py-1">
				<p className="text-xs text-base-content/60">
					Tests latency for {props.servers.length} DNS server
					{props.servers.length === 1 ? '' : 's'} against your selected target
					website to find the fastest and most reliable connection.
				</p>

				<div className="flex flex-col gap-1.5">
					<span className="text-xs font-medium text-base-content/70">
						Target website for speed benchmark
					</span>

					<select
						value={targetKey}
						disabled={isTesting}
						onChange={(e) => setTargetKey(e.target.value)}
						className="border cursor-pointer select select-sm rounded-xl bg-base-200 border-base-300 outline-primary/30 text-xs font-medium"
					>
						<option value={CUSTOM_BENCHMARK_TARGET_KEY}>Custom URL...</option>
						{benchmarkTargets.map((target) => (
							<option key={target.key} value={target.key}>
								{target.label}
							</option>
						))}
					</select>

					{isCustomTarget && (
						<TextInput
							value={customUrl}
							onChange={setCustomUrl}
							placeholder="https://example.com"
							disabled={isTesting}
						/>
					)}
				</div>

				<Button
					size="sm"
					isPrimary
					loading={isTesting}
					disabled={isTesting}
					onClick={startTest}
					className="rounded-xl py-2 font-medium cursor-pointer"
				>
					<div className="flex items-center justify-center gap-2">
						<IoPlay size={14} />
						{isTesting ? 'Testing DNS Servers...' : 'Run Speed Test'}
					</div>
				</Button>

				<div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5">
					{isTesting &&
						Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="h-12 rounded-xl skeleton bg-base-200"
							/>
						))}

					{!isTesting && sortedResults?.length === 0 && (
						<div className="py-8 text-xs text-center rounded-xl bg-base-200 text-base-content/50">
							No DNS server results available
						</div>
					)}

					{!isTesting &&
						sortedResults?.map((result) => {
							const isBest = bestServerResult?.key === result.key

							return (
								<div
									key={result.key}
									className={`flex items-center justify-between gap-2 px-3 py-2 border rounded-xl transition-all ${
										isBest
											? 'bg-base-100 border-success/40 shadow-sm'
											: 'bg-base-200 border-base-300'
									}`}
								>
									<div className="flex flex-col min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-xs font-semibold truncate text-base-content">
												{result.name}
											</span>
											{isBest && (
												<span className="px-1.5 py-0.2 text-[9px] rounded-lg bg-success/20 text-success">
													#1 Best
												</span>
											)}
										</div>
										<span
											className={`w-fit mt-0.5 rounded-lg px-2 py-0.5 text-[10px] font-medium ${
												statusStyles[result.status]
											}`}
										>
											{statusLabels[result.status]}
										</span>
									</div>

									<div className="flex items-center gap-2.5 shrink-0">
										<div className="flex items-center gap-1 select-none">
											{getPingIcon(result.ping)}
											<span className="text-xs font-mono text-base-content/70">
												{result.ping === -1
													? 'N/A'
													: `${result.ping}ms`}
											</span>
										</div>

										{result.status === 'ok' && (
											<Button
												size="xs"
												className={`rounded-lg font-medium cursor-pointer ${
													isBest
														? 'btn-success btn-outline text-success hover:bg-success hover:text-success-content'
														: 'btn-ghost text-primary hover:bg-base-300'
												}`}
												onClick={() => selectServer(result)}
											>
												Select
											</Button>
										)}
									</div>
								</div>
							)
						})}
				</div>
			</div>
		</Modal>
	)
}
