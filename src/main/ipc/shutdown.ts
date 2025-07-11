import { exec } from 'node:child_process'
import { ipcMain } from 'electron'
import { EventsKeys } from '../../shared/constants/eventsKeys.constant'

interface ScheduledShutdown {
	id: string
	scheduledTime: Date
	isActive: boolean
	description?: string
	timeoutId?: NodeJS.Timeout
}

const activeShutdowns: Map<string, ScheduledShutdown> = new Map()

ipcMain.handle(
	EventsKeys.SCHEDULE_SHUTDOWN,
	async (
		_,
		data: {
			delay: number
			scheduledTime: Date
			description?: string
		},
	) => {
		try {
			const id = Date.now().toString()

			await cancelAllScheduledShutdowns()

			const shutdownCommand = getShutdownCommand(Math.floor(data.delay / 1000))

			return new Promise<string>((resolve, reject) => {
				exec(shutdownCommand, (error) => {
					if (error) {
						console.error('Failed to schedule shutdown:', error)
						reject(new Error('Failed to schedule shutdown'))
						return
					}

					const shutdown: ScheduledShutdown = {
						id,
						scheduledTime: new Date(data.scheduledTime),
						isActive: true,
						description: data.description,
					}

					activeShutdowns.set(id, shutdown)
					resolve(id)
				})
			})
		} catch (error) {
			throw new Error(`Failed to schedule shutdown: ${error}`)
		}
	},
)

ipcMain.handle(
	EventsKeys.CANCEL_SCHEDULED_SHUTDOWN,
	async (_, shutdownId: string) => {
		try {
			const shutdown = activeShutdowns.get(shutdownId)
			if (!shutdown) {
				throw new Error('Shutdown not found')
			}

			const cancelCommand = getCancelShutdownCommand()

			return new Promise<boolean>((resolve, reject) => {
				exec(cancelCommand, (error) => {
					if (error) {
						console.error('Failed to cancel shutdown:', error)
						reject(new Error('Failed to cancel shutdown'))
						return
					}

					activeShutdowns.delete(shutdownId)
					resolve(true)
				})
			})
		} catch (error) {
			throw new Error(`Failed to cancel shutdown: ${error}`)
		}
	},
)

ipcMain.handle(EventsKeys.CLEAR_ALL_SHUTDOWNS, async () => {
	try {
		await cancelAllScheduledShutdowns()
		return { success: true }
	} catch (error) {
		throw new Error(`Failed to clear all shutdowns: ${error}`)
	}
})

async function cancelAllScheduledShutdowns(): Promise<void> {
	const cancelCommand = getCancelShutdownCommand()

	return new Promise((resolve) => {
		exec(cancelCommand, (error) => {
			if (error) {
				console.log('No existing shutdown to cancel or failed to cancel')
			}
			// Clear our tracking
			activeShutdowns.clear()
			resolve()
		})
	})
}

function getShutdownCommand(delayInSeconds: number): string {
	const platform = process.platform

	switch (platform) {
		case 'win32':
			return `shutdown /s /t ${delayInSeconds} /c "Scheduled shutdown from DNS Changer"`
		case 'darwin': // macOS
			return `sudo shutdown -h +${Math.ceil(delayInSeconds / 60)}` // macOS uses minutes
		case 'linux':
			return `shutdown -h +${Math.ceil(delayInSeconds / 60)}` // Linux uses minutes
		default:
			throw new Error(`Unsupported platform: ${platform}`)
	}
}

function getCancelShutdownCommand(): string {
	const platform = process.platform

	switch (platform) {
		case 'win32':
			return 'shutdown /a'
		case 'darwin': // macOS
			return 'sudo killall shutdown'
		case 'linux':
			return 'shutdown -c'
		default:
			throw new Error(`Unsupported platform: ${platform}`)
	}
}
