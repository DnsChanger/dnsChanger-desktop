import { IoCloseCircle, IoReload, IoSearch } from 'react-icons/io5'
import type { Server } from '../../../shared/interfaces/server.interface'
import { TextInput } from '../input/text-input'
import { Button } from '../button/button'
import { BenchmarkDnsButtonComponent } from '../buttons/benchmark-dns-btn.component'

export interface ExploreHeaderProps {
	search: string
	onSearchChange: (value: string) => void
	onClearSearch: () => void
	isInitialLoading: boolean
	isBackgroundRefreshing: boolean
	onReload: () => void
	filteredServers: Server[]
	totalServersCount: number
}

export function ExploreHeaderComponent({
	search,
	onSearchChange,
	onClearSearch,
	isInitialLoading,
	isBackgroundRefreshing,
	onReload,
	filteredServers,
	totalServersCount,
}: ExploreHeaderProps) {
	return (
		<div className="px-4 py-3 border-b border-base-300 bg-base-100 flex flex-col gap-2 shrink-0 shadow-sm">
			<div className="flex items-center justify-between gap-2.5">
				<div className="relative flex-1">
					<IoSearch
						size={16}
						className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-base-content/40"
					/>
					<TextInput
						type="text"
						className="pl-9 pr-8 bg-base-200 border-base-300 text-sm rounded-xl focus:border-primary"
						placeholder="Search DNS servers or tags..."
						value={search}
						onChange={(value) => onSearchChange(value)}
						disabled={isInitialLoading}
					/>
					{search && (
						<button
							onClick={onClearSearch}
							className="absolute -translate-y-1/2 right-2.5 top-1/2 text-base-content/40 hover:text-base-content"
							aria-label="Clear search"
						>
							<IoCloseCircle size={16} />
						</button>
					)}
				</div>

				<Button
					size="sm"
					className="btn-ghost rounded-xl text-base-content/70 hover:text-base-content"
					loading={isInitialLoading || isBackgroundRefreshing}
					onClick={onReload}
				>
					<IoReload size={18} />
				</Button>

				<BenchmarkDnsButtonComponent servers={filteredServers} />
			</div>

			<div className="flex items-center justify-between text-xs text-base-content/60 px-1">
				<span className="flex items-center gap-2">
					{isInitialLoading ? (
						<span className="h-4 w-36 skeleton rounded bg-base-200" />
					) : (
						<>
							<span className="font-medium text-base-content/80">
								{filteredServers.length}
							</span>{' '}
							DNS Servers Available
							{isBackgroundRefreshing && (
								<span className="ml-1 text-[11px] animate-pulse text-primary font-medium">
									Updating...
								</span>
							)}
						</>
					)}
				</span>

				{search && <span>Filtered from {totalServersCount}</span>}
			</div>
		</div>
	)
}
