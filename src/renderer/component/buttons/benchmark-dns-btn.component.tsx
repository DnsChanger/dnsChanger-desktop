import { useState } from 'react'
import { MdSpeed } from 'react-icons/md'

import type { Server } from '../../../shared/interfaces/server.interface'
import { DnsBenchmarkModalComponent } from '../modals/dns-benchmark.component'
import Tooltip from '../tooltip/toolTip'
import { Button } from '../button/button'
import { cn } from '../../utils/cn'

interface Props {
	servers: Server[]
	className?: string
}

export function BenchmarkDnsButtonComponent({ servers, className }: Props) {
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

	return (
		<div>
			<Tooltip content="Find Best DNS Server" position="left">
				<Button
					size="sm"
					onClick={() => setIsOpenModal(true)}
					className={cn(
						'bg-base-200 hover:bg-base-300 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer',
						className
					)}
				>
					<MdSpeed className="text-base-content/80" size={15} />
				</Button>
			</Tooltip>

			<DnsBenchmarkModalComponent
				isOpen={isOpenModal}
				setIsOpen={setIsOpenModal}
				servers={servers}
			/>
		</div>
	)
}
