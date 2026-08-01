import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsClock, BsPower } from 'react-icons/bs'
import { MdClear, MdTimer } from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import { Button } from '../component/button/button'

export function ShutdownPage() {
	const [scheduledTime, setScheduledTime] = useState('')
	const [scheduledDate, setScheduledDate] = useState('')
	const [loading, setLoading] = useState(false)
	const [clearingAll, setClearingAll] = useState(false)

	useEffect(() => {
		const now = new Date()
		const currentDate = now.toISOString().split('T')[0]
		const currentTime = now.toTimeString().slice(0, 5)
		setScheduledDate(currentDate)
		setScheduledTime(currentTime)
	}, [])

	const applyQuickPreset = (minutes: number) => {
		const target = new Date(Date.now() + minutes * 60 * 1000)
		setScheduledDate(target.toISOString().split('T')[0])
		setScheduledTime(target.toTimeString().slice(0, 5))
	}

	const getSchedulePreview = () => {
		if (!scheduledDate || !scheduledTime) return null
		const target = new Date(`${scheduledDate}T${scheduledTime}`)
		const now = new Date()
		const diffMs = target.getTime() - now.getTime()
		if (Number.isNaN(diffMs) || diffMs <= 0) return null

		const totalMinutes = Math.floor(diffMs / (1000 * 60))
		const hours = Math.floor(totalMinutes / 60)
		const mins = totalMinutes % 60

		const timeRemainingText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

		return {
			formattedTime: target.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			}),
			timeRemainingText,
		}
	}

	const preview = getSchedulePreview()

	const handleScheduleShutdown = async () => {
		if (!scheduledDate || !scheduledTime) {
			toast.error('Please select date and time')
			return
		}

		const scheduleDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
		const now = new Date()

		if (scheduleDateTime <= now) {
			toast.error('Please select a future time')
			return
		}

		setLoading(true)
		try {
			const delay = scheduleDateTime.getTime() - now.getTime()
			await window.ipc.scheduleShutdown({
				delay,
				scheduledTime: scheduleDateTime,
				description: `Shutdown at ${scheduleDateTime.toLocaleString()}`,
			})

			toast.success('Shutdown scheduled successfully!')
		} catch (error) {
			toast.error('Failed to schedule shutdown')
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	const handleClearAllShutdowns = async () => {
		setClearingAll(true)
		try {
			await window.ipc.clearAllShutdowns()
			toast.success('All scheduled shutdowns cleared')
		} catch (error) {
			toast.error('Failed to clear all shutdowns')
			console.error(error)
		} finally {
			setClearingAll(false)
		}
	}

	return (
		<div className="w-full h-full p-5 overflow-y-auto bg-base-300 flex flex-col gap-5">
			<div className="flex items-center gap-3.5 px-1">
				<div className="p-2.5 rounded-2xl bg-error text-error-content shadow-sm flex items-center justify-center shrink-0">
					<BsPower className="text-2xl" />
				</div>
				<div>
					<h1 className="text-lg font-bold text-base-content leading-tight">
						Shutdown Control
					</h1>
					<p className="text-xs text-base-content/60 mt-0.5">
						Schedule automatic system power off or manage active timers
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
				<div className="p-4 border rounded-2xl bg-base-100 border-base-300 shadow-sm flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<BsClock className="text-error" size={18} />
							<h2 className="text-sm font-semibold text-base-content">
								Schedule Shutdown
							</h2>
						</div>

						{preview && (
							<span className="px-2 py-0.5 text-[11px] font-medium rounded-lg bg-error/10 text-error border border-error/20 flex items-center gap-1">
								<MdTimer size={13} />
								in {preview.timeRemainingText}
							</span>
						)}
					</div>

					<div className="flex flex-col gap-3">
						<div>
							<label className="block mb-1.5 text-xs font-medium text-base-content/70">
								Quick Presets
							</label>
							<div className="grid grid-cols-5 gap-1.5">
								{[
									{ label: '+15m', mins: 15 },
									{ label: '+30m', mins: 30 },
									{ label: '+1h', mins: 60 },
									{ label: '+2h', mins: 120 },
									{ label: '+3h', mins: 180 },
								].map((preset) => (
									<button
										key={preset.label}
										type="button"
										onClick={() => applyQuickPreset(preset.mins)}
										className="py-1 text-xs font-medium rounded-lg bg-base-200 border border-base-300 text-base-content/80 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-150 cursor-pointer text-center"
									>
										{preset.label}
									</button>
								))}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3.5">
							<div>
								<label className="block mb-1.5 text-xs font-medium text-base-content/70">
									Target Date
								</label>
								<input
									type="date"
									value={scheduledDate}
									onChange={(e) => setScheduledDate(e.target.value)}
									className="w-full px-3 py-2 text-xs font-medium text-base-content bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all"
									min={new Date().toISOString().split('T')[0]}
								/>
							</div>

							<div>
								<label className="block mb-1.5 text-xs font-medium text-base-content/70">
									Target Time
								</label>
								<input
									type="time"
									value={scheduledTime}
									onChange={(e) => setScheduledTime(e.target.value)}
									className="w-full px-3 py-2 text-xs font-medium text-base-content bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all"
								/>
							</div>
						</div>

						<Button
							size="sm"
							onClick={handleScheduleShutdown}
							disabled={loading}
							className="flex items-center justify-center w-full py-2.5 mt-1 text-xs font-semibold rounded-xl btn-error text-error-content transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm disabled:opacity-50"
						>
							{loading ? (
								<span className="loading loading-spinner loading-xs" />
							) : (
								<>
									<BsClock size={14} className="mr-1.5" />
									Schedule System Shutdown
								</>
							)}
						</Button>
					</div>
				</div>

				<div className="flex flex-col p-4 border rounded-2xl bg-base-100 border-base-300 shadow-sm justify-between gap-4">
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2">
							<MdClear className="text-base-content/70" size={18} />
							<h2 className="text-sm font-semibold text-base-content">
								Cancel & Clear
							</h2>
						</div>

						<p className="text-xs text-base-content/70 leading-relaxed">
							Cancel all active and pending scheduled shutdown tasks on your machine.
						</p>

						<Button
							size="sm"
							onClick={handleClearAllShutdowns}
							disabled={clearingAll}
							className="flex items-center justify-center w-full py-2.5 text-xs font-semibold rounded-xl btn-outline border-base-300 hover:bg-base-200 text-base-content transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
						>
							{clearingAll ? (
								<span className="loading loading-spinner loading-xs" />
							) : (
								<>
									<MdClear size={16} className="mr-1.5" />
									Clear All Scheduled Tasks
								</>
							)}
						</Button>
					</div>

					<div className="flex items-start gap-2.5 p-3 rounded-xl bg-info/10 border border-info/20 text-info">
						<FiInfo className="w-4 h-4 shrink-0 mt-0.5 text-info" />
						<div className="text-xs">
							<span className="font-semibold block text-info">Important Note</span>
							<span className="text-info/80 text-[11px] leading-tight block mt-0.5">
								Ensure all unsaved documents and files are saved before your target shutdown time.
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
