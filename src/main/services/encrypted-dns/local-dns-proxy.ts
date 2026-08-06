import dgram from 'node:dgram'
import http from 'node:http'
import https from 'node:https'
import tls from 'node:tls'
import { URL } from 'node:url'
import { userLogger } from '../../shared/logger'

export type ProxyUpstream =
	| { kind: 'doh'; url: string }
	| { kind: 'dot'; host: string; port?: number; servername?: string }

/**
 * Minimal UDP DNS stub that forwards queries to a DoH or DoT upstream.
 * Intended to listen on 127.0.0.1:53 while the OS points at localhost.
 */
export class LocalDnsProxy {
	private socket: dgram.Socket | null = null
	private readonly upstream: ProxyUpstream
	private readonly listenHost: string
	private readonly listenPort: number

	constructor(upstream: ProxyUpstream, options?: { host?: string; port?: number }) {
		this.upstream = upstream
		this.listenHost = options?.host ?? '127.0.0.1'
		this.listenPort = options?.port ?? 53
	}

	get address() {
		return { host: this.listenHost, port: this.listenPort }
	}

	async start(): Promise<void> {
		if (this.socket) return

		const socket = dgram.createSocket('udp4')
		this.socket = socket

		socket.on('message', (msg, rinfo) => {
			this.forward(msg)
				.then((response) => {
					if (!response?.length) return
					socket.send(response, rinfo.port, rinfo.address)
				})
				.catch((error) => {
					userLogger.error(
						error instanceof Error ? error.stack : String(error),
						'LocalDnsProxy forward failed'
					)
				})
		})

		await new Promise<void>((resolve, reject) => {
			const onError = (error: Error) => {
				socket.close()
				this.socket = null
				reject(error)
			}
			socket.once('error', onError)
			socket.bind(this.listenPort, this.listenHost, () => {
				socket.off('error', onError)
				resolve()
			})
		})
	}

	async stop(): Promise<void> {
		const socket = this.socket
		this.socket = null
		if (!socket) return

		await new Promise<void>((resolve) => {
			socket.close(() => resolve())
		})
	}

	private async forward(query: Buffer): Promise<Buffer> {
		if (this.upstream.kind === 'doh') {
			return this.forwardDoh(query, this.upstream.url)
		}
		return this.forwardDot(
			query,
			this.upstream.host,
			this.upstream.port ?? 853,
			this.upstream.servername ?? this.upstream.host
		)
	}

	private forwardDoh(query: Buffer, dohUrl: string): Promise<Buffer> {
		const url = new URL(dohUrl)
		const transport = url.protocol === 'http:' ? http : https

		return new Promise((resolve, reject) => {
			const req = transport.request(
				{
					protocol: url.protocol,
					hostname: url.hostname,
					port: url.port || (url.protocol === 'http:' ? 80 : 443),
					path: `${url.pathname}${url.search}`,
					method: 'POST',
					headers: {
						'content-type': 'application/dns-message',
						accept: 'application/dns-message',
						'content-length': query.length,
					},
					timeout: 8_000,
				},
				(res) => {
					const chunks: Buffer[] = []
					res.on('data', (chunk) => chunks.push(chunk))
					res.on('end', () => {
						if ((res.statusCode || 0) >= 400) {
							reject(
								new Error(`DoH upstream returned HTTP ${res.statusCode}`)
							)
							return
						}
						resolve(Buffer.concat(chunks))
					})
				}
			)
			req.on('error', reject)
			req.on('timeout', () => {
				req.destroy(new Error('DoH upstream timeout'))
			})
			req.write(query)
			req.end()
		})
	}

	private forwardDot(
		query: Buffer,
		host: string,
		port: number,
		servername: string
	): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const socket = tls.connect(
				{
					host,
					port,
					servername,
					timeout: 8_000,
				},
				() => {
					const len = Buffer.alloc(2)
					len.writeUInt16BE(query.length, 0)
					socket.write(Buffer.concat([len, query]))
				}
			)

			let buffer = Buffer.alloc(0)
			let expected = -1

			socket.on('data', (chunk) => {
				buffer = Buffer.concat([buffer, chunk])
				if (expected < 0 && buffer.length >= 2) {
					expected = buffer.readUInt16BE(0)
					buffer = buffer.subarray(2)
				}
				if (expected >= 0 && buffer.length >= expected) {
					const response = buffer.subarray(0, expected)
					socket.end()
					resolve(response)
				}
			})
			socket.on('error', reject)
			socket.on('timeout', () => {
				socket.destroy(new Error('DoT upstream timeout'))
			})
		})
	}
}
