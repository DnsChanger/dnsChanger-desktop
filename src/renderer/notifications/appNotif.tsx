import toast from 'react-hot-toast'
import { BiErrorAlt } from 'react-icons/bi'
import { TiInputChecked } from 'react-icons/ti'

export function appNotif(
	title: string,
	msg: string,
	type: 'SUCCESS' | 'ERROR' = 'ERROR',
) {
	return toast.custom(
		(t) => (
			<div
				className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#CCCCCC] dark:bg-[#262626] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
			>
				<div className="flex-1 w-0 p-4">
					<div className="flex items-start">
						<div className="flex-shrink-0 pt-0.5">
							{type == 'SUCCESS' ? (
								<TiInputChecked size={50} className={'text-green-500'} />
							) : (
								<BiErrorAlt size={50} className={'text-red-500'} />
							)}
						</div>
						<div className="flex-1 ml-3">
							<p className="text-sm font-medium ">{title}</p>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-500">
								{msg}
							</p>
						</div>
					</div>
				</div>
			</div>
		),
		{
			position: 'top-center',
			duration: 200,
		},
	)
}
