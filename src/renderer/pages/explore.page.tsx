import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IoAlertCircleOutline } from 'react-icons/io5'

import type { Server } from '../../shared/interfaces/server.interface'
import { useGetDnsList } from '../hook/fetch-dns'
import { ExploreHeaderComponent } from '../component/explore/explore-header.component'
import { ExploreEmptyStateComponent } from '../component/explore/explore-empty-state.component'
import { ServerCardSkeletonComponent } from '../component/cards/server-skeleton.card.component'
import { ServerCardComponent } from '../component/cards/server.card.component'

const PING_CACHE_TTL = 60 * 1000

type PingCacheEntry = { ping: number; timestamp: number }

export function ExplorePage() {
	const [servers, setServers] = useState<Server[]>([])
	const [installedServers, setInstalledServers] = useState<Server[]>([])
	const [search, setSearch] = useState('')
	const [isPinging, setIsPinging] = useState(false)
	const [loadError, setLoadError] = useState<string | null>(null)

	const {
		data: fetchedDnsList,
		refetch,
		isLoading: isListLoading,
		isFetching: isListFetching,
		isError: isListError,
	} = useGetDnsList()

	const pingCache = useRef<Map<string, PingCacheEntry>>(new Map())
	const requestIdRef = useRef(0)

	const pingServer = useCallback(
		async (server: Server, force = false): Promise<Server> => {
			const cached = pingCache.current.get(server.key)
			const now = Date.now()

			if (!force && cached && now - cached.timestamp < PING_CACHE_TTL) {
				return { ...server, ping: cached.ping }
			}

			try {
				const response = await window.ipc.ping(server)
				const ping = Number(response?.data?.time) || -1
				pingCache.current.set(server.key, { ping, timestamp: now })
				return { ...server, ping }
			} catch {
				pingCache.current.set(server.key, { ping: -1, timestamp: now })
				return { ...server, ping: -1 }
			}
		},
		[]
	)

	const updateServers = useCallback(
		async (list: Server[], requestId: number, force = false) => {
			setIsPinging(true)
			try {
				const result = await Promise.all(
					list.map((server) => pingServer(server, force))
				)
				if (requestId !== requestIdRef.current) return

				result.sort((a, b) =>
					a.ping === -1 ? 1 : b.ping === -1 ? -1 : a.ping - b.ping
				)

				setServers(result)
			} finally {
				if (requestId === requestIdRef.current) setIsPinging(false)
			}
		},
		[pingServer]
	)

	const fetchCurrentDnsList = useCallback(
		async (list: Server[], force = false) => {
			const requestId = ++requestIdRef.current
			setLoadError(null)

			try {
				const response = await window.ipc.fetchDnsList()
				if (requestId !== requestIdRef.current) return

				setInstalledServers(response.servers || [])
				await updateServers(list, requestId, force)
			} catch {
				if (requestId === requestIdRef.current) {
					setLoadError('Failed to retrieve the list of installed servers.')
				}
			}
		},
		[updateServers]
	)

	useEffect(() => {
		if (!fetchedDnsList) return

		if (fetchedDnsList.length > 0) {
			fetchCurrentDnsList(fetchedDnsList)
		} else {
			setServers([])
		}
	}, [fetchedDnsList, fetchCurrentDnsList])

	const handleReload = async () => {
		pingCache.current.clear()
		const result = await refetch()
		const targetList = result.data || fetchedDnsList
		if (targetList && targetList.length > 0) {
			await fetchCurrentDnsList(targetList, true)
		}
	}

	const isInitialLoading =
		servers.length === 0 &&
		!loadError &&
		!isListError &&
		(isListLoading ||
			isPinging ||
			isListFetching ||
			!fetchedDnsList ||
			(fetchedDnsList && fetchedDnsList.length > 0))

	const isBackgroundRefreshing = (isListFetching || isPinging) && !isInitialLoading

	const filteredServers = useMemo(() => {
		if (!search.trim()) return servers

		const keyword = search.toLowerCase()
		return servers.filter((server) => {
			return (
				server.name.toLowerCase().includes(keyword) ||
				server.tags.some((tag: string) => tag.toLowerCase().includes(keyword))
			)
		})
	}, [servers, search])

	return (
		<div className="w-full h-full bg-base-300 flex flex-col overflow-hidden">
			<ExploreHeaderComponent
				search={search}
				onSearchChange={setSearch}
				onClearSearch={() => setSearch('')}
				isInitialLoading={isInitialLoading}
				isBackgroundRefreshing={isBackgroundRefreshing}
				onReload={handleReload}
				filteredServers={filteredServers}
				totalServersCount={servers.length}
			/>

			{/* Server List Container */}
			<div className="flex-1 px-4 py-3 overflow-y-auto">
				<div className="flex flex-col gap-2.5 max-w-3xl mx-auto pb-24">
					{loadError && !isInitialLoading && (
						<div className="flex items-center justify-between gap-3 p-3 text-sm border rounded-2xl border-error/30 bg-error/10 text-error">
							<div className="flex items-center gap-2">
								<IoAlertCircleOutline size={18} className="shrink-0" />
								<span>{loadError}</span>
							</div>
							<button
								onClick={() =>
									fetchedDnsList &&
									fetchCurrentDnsList(fetchedDnsList, true)
								}
								className="font-medium underline whitespace-nowrap"
							>
								Retry
							</button>
						</div>
					)}

					{isListError && (
						<div className="flex items-center justify-between gap-3 p-3 text-sm border rounded-2xl border-error/30 bg-error/10 text-error">
							<div className="flex items-center gap-2">
								<IoAlertCircleOutline size={18} className="shrink-0" />
								<span>Failed to fetch DNS servers list.</span>
							</div>
							<button
								onClick={handleReload}
								className="font-medium underline whitespace-nowrap"
							>
								Retry
							</button>
						</div>
					)}

					{isInitialLoading &&
						Array.from({ length: 6 }).map((_, index) => (
							<ServerCardSkeletonComponent key={index} />
						))}

					{!isInitialLoading &&
						!isListError &&
						filteredServers.length === 0 && (
							<ExploreEmptyStateComponent
								search={search}
								onClearSearch={() => setSearch('')}
							/>
						)}

					{!isInitialLoading &&
						filteredServers.map((server) => (
							<ServerCardComponent
								key={server.key}
								server={server}
								storeServers={installedServers}
								setStoreServers={setInstalledServers}
							/>
						))}
				</div>
			</div>
		</div>
	)
}
