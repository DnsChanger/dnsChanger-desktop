import { useState } from 'react'
import { MdLan } from 'react-icons/md'
import { NetworkOptionsModalComponent } from '../modals/network-options.component'
import Tooltip from '../tooltip/toolTip'
import { Button } from '../button/button'

export function InterfacesDialogButtonComponent() {
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

	function toggleOpenModal() {
		setIsOpenModal(!isOpenModal)
	}

	return (
		<div>
			<Tooltip content="Network Switcher (LAN / Wi-Fi)" position="left">
				<Button
					size={'sm'}
					onClick={toggleOpenModal}
					className="bg-base-200 hover:bg-base-200/80 rounded-xl"
				>
					<MdLan className="text-base-content/80" size={15} />
				</Button>
				<NetworkOptionsModalComponent
					isOpen={isOpenModal}
					setIsOpen={setIsOpenModal}
				/>
			</Tooltip>
		</div>
	)
}
