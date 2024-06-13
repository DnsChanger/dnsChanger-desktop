import { Button, Tooltip } from 'react-daisyui'
import { useContext, useState } from 'react'
import { serversContext } from '../../context/servers.context'
import { BsHddNetwork } from 'react-icons/bs'
import { NetworkOptionsModalComponent } from '../modals/network-options.component'

export function InterfacesDialogButtonComponent() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const serversStateContext = useContext(serversContext)

  function toggleOpenModal() {
    setIsOpenModal(!isOpenModal)
  }

  return (
    <div>
      <Tooltip message="Network Interfaces" position="top">
        <Button
          shape={'square'}
          size={'sm'}
          onClick={toggleOpenModal}
          className={
            'bg-base-200 hover:bg-[#d3d2d2] dark:bg-[#262626] hover:dark:bg-[#323232]  border-none text-center transition-all duration-300 ease-in-out'
          }>
          <BsHddNetwork className={'dark:text-gray-600 text-gray-700'} size={16} />
        </Button>
        <NetworkOptionsModalComponent
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          cb={va => {
            serversStateContext.servers.push(va)
            serversStateContext.setServers([...serversStateContext.servers])
          }}
        />
      </Tooltip>
    </div>
  )
}
