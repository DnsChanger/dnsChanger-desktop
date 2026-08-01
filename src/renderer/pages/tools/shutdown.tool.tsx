import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import ReactGA from 'react-ga4'
import { BsClock } from 'react-icons/bs'
import { MdClear } from 'react-icons/md'
import { FiInfo } from 'react-icons/fi'
import { Button } from '../../component/button/button'

export function ShutdownTool() {
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
		ReactGA.event({
			category: 'ShutdownTool',
			action: 'QUICK_PRESET',
			label: `${minutes}m`,
		})
	}

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

			ReactGA.event({
				category: 'ShutdownTool',
				action: 'SCHEDULE_SHUTDOWN',
				value: Math.floor(delay / 1000),
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
			ReactGA.event({
				category: 'ShutdownTool',
				action: 'CLEAR_SHUTDOWNS',
			})
			toast.success('All scheduled shutdowns cleared')
		} catch (error) {
			toast.error('Failed to clear all shutdowns')
			console.error(error)
		} finally {
			setClearingAll(false)
		}
	}

	return (
		<div className="space-y-4">
			<div className="border shadow-md bg-base-100 rounded-2xl border-base-300 overflow-hidden">
				<div className="p-4 flex flex-col gap-4">
					<div>
						<label className="block mb-1.5 text-xs font-medium text-base-content/70">
							Quick Presets{' '}
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
									className="py-1.5 text-xs font-medium rounded-lg bg-base-200 border border-base-300 text-base-content/80 hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-150 cursor-pointer text-center"
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

					<div className="grid grid-cols-2 gap-3 mt-1">
						<Button
							size="sm"
							onClick={handleClearAllShutdowns}
							disabled={clearingAll}
							className="rounded-xl"
						>
							{clearingAll ? (
								<span className="loading loading-spinner loading-xs" />
							) : (
								<>
									<MdClear size={15} className="mr-1.5" />
									Clear All Tasks
								</>
							)}
						</Button>

						<Button
							size="sm"
							onClick={handleScheduleShutdown}
							disabled={loading}
							className="flex items-center justify-center w-full py-2.5 text-xs font-semibold rounded-xl btn-error text-error-content transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm disabled:opacity-50"
						>
							{loading ? (
								<span className="loading loading-spinner loading-xs" />
							) : (
								<>
									<BsClock size={14} className="mr-1.5" />
									Schedule Shutdown
								</>
							)}
						</Button>
					</div>
				</div>
			</div>

			<div className="flex items-start gap-2.5 p-3 rounded-xl bg-info/10 border border-info/20 text-info">
				<FiInfo className="w-4 h-4 shrink-0 mt-0.5 text-info" />
				<div className="text-xs">
					<span className="font-semibold block text-info">Important Note</span>
					<span className="text-info/80 text-[11px] leading-tight block mt-0.5">
						Ensure all unsaved documents and files are saved before your
						target shutdown time.
					</span>
				</div>
			</div>
		</div>
	)
}
