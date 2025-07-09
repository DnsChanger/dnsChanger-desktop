import { Button, Input, Typography } from '@material-tailwind/react'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { BsClock, BsPower } from 'react-icons/bs'
import { MdClear } from 'react-icons/md'

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

			// Reset to +1 hour
			const futureTime = new Date(now.getTime() + 60 * 60 * 1000)
			setScheduledDate(futureTime.toISOString().split('T')[0])
			setScheduledTime(futureTime.toTimeString().slice(0, 5))
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
		<div className="p-4">
			<div className="flex flex-col h-full gap-4">
				{/* Header */}
				<div className="flex items-center gap-3">
					<div className="p-3 bg-red-100 rounded-full dark:bg-red-900/20">
						<BsPower className="text-2xl text-red-500" />
					</div>
					<div>
						<Typography
							variant="h5"
							className="text-gray-800 dark:text-white font-[balooTamma]"
						>
							Shutdown Control
						</Typography>
						<Typography className="text-sm text-gray-600 dark:text-gray-400 font-[Inter]">
							Schedule or clear shutdown operations
						</Typography>
					</div>
				</div>

				<div className="flex flex-row gap-2">
					{/* Schedule Section */}
					<div className="flex-1  dark:bg-[#262626] bg-base-200 shadow p-4 rounded-lg w-full">
						<Typography
							variant="h6"
							className="mb-3 text-gray-800 dark:text-white font-[balooTamma]"
						>
							Schedule Shutdown
						</Typography>{' '}
						<div className="flex flex-col gap-3 mb-3">
							<div>
								<Typography className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 font-[Inter]">
									Date
								</Typography>
								<Input
									type="date"
									value={scheduledDate}
									onChange={(e) => setScheduledDate(e.target.value)}
									className="w-full dark:text-gray-300 font-[Inter]"
									crossOrigin={undefined}
								/>
							</div>
							<div>
								<Typography className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 font-[Inter]">
									Time
								</Typography>
								<Input
									type="time"
									value={scheduledTime}
									onChange={(e) => setScheduledTime(e.target.value)}
									className="w-full dark:text-gray-300 font-[Inter]"
									crossOrigin={undefined}
								/>
							</div>
						</div>
						<Button
							onClick={handleScheduleShutdown}
							disabled={loading}
							className="flex items-center justify-center w-full py-2 bg-red-500 hover:bg-red-600 font-[Inter] normal-case text-sm font-normal"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
									Scheduling...
								</div>
							) : (
								<div className="flex items-center justify-center gap-2">
									<BsClock size={16} />
									Schedule Shutdown
								</div>
							)}
						</Button>
					</div>

					{/* Clear All Section */}
					<div className="dark:bg-[#262626] bg-base-200 shadow p-4 rounded-lg">
						<Typography
							variant="h6"
							className="mb-3 text-gray-800 dark:text-white font-[balooTamma]"
						>
							Clear All Shutdowns
						</Typography>

						<Typography className="mb-3 text-sm text-gray-600 dark:text-gray-400 font-[Inter]">
							Cancel all scheduled shutdown operations
						</Typography>

						<Button
							onClick={handleClearAllShutdowns}
							disabled={clearingAll}
							className="flex items-center justify-center w-full py-2 bg-gray-500 hover:bg-gray-600 font-[Inter] normal-case text-sm font-normal"
						>
							{clearingAll ? (
								<div className="flex items-center justify-center">
									<div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
									Clearing...
								</div>
							) : (
								<div className="flex items-center justify-center gap-2">
									<MdClear size={16} />
									Clear All Shutdowns
								</div>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
