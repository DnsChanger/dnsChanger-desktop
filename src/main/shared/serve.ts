import * as path from 'node:path'
import http from 'node:http'
import type { BrowserWindow } from 'electron'
import handler from 'serve-handler'
import getPorts from './get-port'
import Url from 'node:url'
import isDev from './isDev'
import { userLogger } from './logger'

// Internals
// =========
const isDevelopment = isDev

// Dynamic Renderer
// ================
export default async function (mainWindow: BrowserWindow) {
	if (isDevelopment) {
		const startUrl =
			process.env.VITE_DEV_SERVER_URL ||
			Url.format({
				pathname: path.join(process.env.DIST, 'index.html'),
				protocol: 'file:',
				slashes: true,
			})

		return mainWindow.loadURL(startUrl)
	}

	const port = await getPorts({ port: 55303, host: '127.0.0.1' })

	const server = http.createServer((request, response) => {
		return handler(request, response, {
			public: process.env.DIST,
			directoryListing: false,
		})
	})

	server.on('error', (err) => {
		userLogger.error(err.stack, err.message || 'Local server error')
	})

	await new Promise((resolve, reject) => {
		server.listen(port, '127.0.0.1', () => {
			console.log('Dynamic-Renderer Listening on', port)
			mainWindow
				.loadURL(`http://127.0.0.1:${port}`)
				.then(() => resolve(true))
				.catch(reject)
		})
		server.once('error', reject)
	})
}
