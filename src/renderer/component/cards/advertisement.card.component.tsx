export function AdvertisementCardComponent() {
	return (
		<div
			className={
				'mt-4 p-4 dark:bg-[#262626] bg-base-200 border dark:border-gray-600 border-gray-200 rounded-lg shadow-sm'
			}
		>
			<div className={'text-center'}>
				<h3
					className={
						'text-sm font-semibold dark:text-gray-300 text-gray-700 mb-2'
					}
				>
					Your Ads Here
				</h3>
				<p className={'text-xs dark:text-gray-400 text-gray-500 mb-3'}>
					Advertisement space available
				</p>
				<div className={'flex justify-center'}>
					<button
						className={
							'px-4 py-2 dark:bg-gray-700 bg-gray-300 dark:text-gray-300 text-gray-600 text-xs rounded dark:hover:bg-gray-600 hover:bg-gray-400 transition-colors'
						}
					>
						Contact for Advertisement
					</button>
				</div>
			</div>
		</div>
	)
}
