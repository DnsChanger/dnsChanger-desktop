import { MdOutlineAddModerator } from 'react-icons/md'
import { Button, Tooltip } from 'react-daisyui'
import { useContext, useState } from 'react'
import { AddDnsModalComponent } from '../modals/add-dns.component'
import { serversContext } from '../../context/servers.context'

export function AddCustomBtnComponent() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const serversStateContext = useContext(serversContext)

  function toggleOpenModal() {
    setIsOpenModal(!isOpenModal)
  }

  return (
    <div>
      <Tooltip message="Add Custom DNS" position="top">
        <Button
          shape={'square'}
          size={'sm'}
          onClick={toggleOpenModal}
          className={
            'bg-base-200 hover:bg-[#d3d2d2] dark:bg-[#262626] hover:dark:bg-[#323232]  border-none text-center transition-all duration-300 ease-in-out'
          }>
          <MdOutlineAddModerator className={'dark:text-gray-600 text-gray-700'} size={16} />
        </Button>
        <AddDnsModalComponent
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
