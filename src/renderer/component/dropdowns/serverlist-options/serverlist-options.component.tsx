import { Dropdown } from 'react-daisyui';
import { UpdateListItemComponent } from './updatelist.item';
import { IoEllipsisVertical } from "react-icons/io5"
import { AddCustomServerItem } from './addServer.item';
import { AddDnsModalComponent } from '../../modals/add-dns.component';
import { useState, useContext } from 'react';
import { ServersContext } from '../../../interfaces/servers-context.interface';
import { serversContext } from '../../../context/servers.context';

export function ServerListOptionsDropDownComponent() {
    const [isOpenModal, setIsOpenModal] = useState<boolean>()
    const serversContextData: ServersContext = useContext<ServersContext>(serversContext);

    function toggleOpenModal() {
        setIsOpenModal(!isOpenModal)
    }
    return (
        <Dropdown>
            <Dropdown.Toggle size="xs">
                <IoEllipsisVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu className={"absolute w-80"}>
                <UpdateListItemComponent />
                <AddCustomServerItem onClick={toggleOpenModal} />
            </Dropdown.Menu>
            <AddDnsModalComponent isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                cb={(va) => {
                    serversContextData.servers.push(va)
                    serversContextData.setServers([...serversContextData.servers])
                }}
            />
        </Dropdown>
    )
}
