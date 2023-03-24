import { useContext } from 'react';
import { Dropdown } from 'react-daisyui';
import { HiOutlineTrash } from 'react-icons/hi';

import { serversContext } from '../../../context/servers.context';
import { Server } from '../../../../shared/interfaces/server.interface';
import { ServersContext } from '../../../interfaces/servers-context.interface';

interface Props {
    server: Server
}

export function DeleteItemComponent(props: Props) {
    const server: Server = props.server;
    const serversContextData = useContext<ServersContext>(serversContext);

    async function clickHandler() {
        const response = await window.ipc.deleteDns(server);

        if (response.success) {
            window.ipc.notif(`${server.names.eng} was successfully removed from the list.`);
            serversContextData.setServers(response.servers);
        } else {
            window.ipc.notif(response.message);
        }
    }

    return (
        <Dropdown.Item onClick={() => clickHandler()}>
            <HiOutlineTrash color={'#ec2222'} />
        </Dropdown.Item>
    )
}
