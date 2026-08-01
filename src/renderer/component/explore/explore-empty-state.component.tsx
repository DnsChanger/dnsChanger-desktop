export interface ExploreEmptyStateProps {
	search: string
	onClearSearch: () => void
}

export function ExploreEmptyStateComponent({
	search,
	onClearSearch,
}: ExploreEmptyStateProps) {
	return (
		<div className="py-12 text-center border rounded-2xl border-base-300 bg-base-100 shadow-sm">
			<h2 className="font-semibold text-base text-base-content">
				No DNS Servers Found
			</h2>
			<p className="mt-1 text-xs text-base-content/60">
				{search
					? 'No server matches your search criteria.'
					: 'No DNS servers available right now.'}
			</p>

			{search && (
				<button
					onClick={onClearSearch}
					className="mt-3 text-xs font-medium text-primary hover:underline"
				>
					Clear search filter
				</button>
			)}
		</div>
	)
}
