export interface Server extends Record<string, any> {
	key: string
	name: string
	servers: string[]
	avatar: string
	rate: number
	tags: string[]
	type: 'ipv4' | 'ipv6'
}
export interface ServerStore extends Server {
	isPin: boolean
}
