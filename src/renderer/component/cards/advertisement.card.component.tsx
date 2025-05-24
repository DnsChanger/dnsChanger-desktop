export function AdvertisementCardComponent() {
	return (
		<div
			className={
				'p-2 dark:bg-[#262626] bg-base-200  rounded-2xl shadow-sm h-[70px] max-h-[70px]'
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
			</div>
		</div>
	)
}
