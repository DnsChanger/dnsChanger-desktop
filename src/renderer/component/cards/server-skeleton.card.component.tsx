export function ServerCardSkeletonComponent() {
	return (
		<div className="border rounded-2xl bg-base-100 border-base-300 p-3.5 shadow-sm">
			<div className="flex items-center gap-3">
				<div className="shrink-0">
					<div className="w-11 h-11 rounded-xl skeleton bg-base-200" />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<div className="h-4 w-28 skeleton rounded bg-base-200" />
							<div className="h-4 w-12 skeleton rounded-md bg-base-200" />
							<div className="h-4 w-12 skeleton rounded-md bg-base-200" />
						</div>
						<div className="h-4 w-14 skeleton rounded bg-base-200" />
					</div>

					<div className="flex items-center justify-between mt-3 pt-2 border-t border-base-300/70">
						<div className="h-3 w-20 skeleton rounded bg-base-200" />
						<div className="h-6 w-16 skeleton rounded-xl bg-base-200" />
					</div>
				</div>
			</div>
		</div>
	)
}

export { ServerCardSkeletonComponent as ServerCardSkeleton }
