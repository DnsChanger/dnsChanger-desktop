
import { Button } from 'react-daisyui';
import { Server } from '../../../constants/servers.cosntant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setState } from '../../../renderer/interfaces/react.interface';
import { useState } from 'react';
interface Props {
    server: Server
    currentActive: string,
    setCurrentActive: setState<string>
}

export function ServerComponent(prop: Props) {
    const server = prop.server
    const isConnect = server.key == prop.currentActive
    return (
        <div dir='auto' className=' mb-2 p-2'>
            <div className="flex flex-nowrap">
                <div className='flex-none'>
                    <FontAwesomeIcon icon={"server"} />
                </div>
                <div className='flex-1 w-64'>{server.names.eng}</div>
                <div>
                    <Button shape='circle' size='sm' color={isConnect ? 'success' : 'warning'}
                        onClick={(e) => clickHandler.apply(e, [server, prop.setCurrentActive, isConnect])}
                    >
                        <FontAwesomeIcon icon={isConnect ? 'stop' : "power-off"} />
                    </Button>
                </div>
            </div>
        </div>
    )
}


async function clickHandler(server: Server, setCurrentActive: setState<string>, isConnect: boolean) {
    try {
        let response;
        if (isConnect) {
            //off
            response = await window.ipc.clearDns();
            response.success && setCurrentActive('')
        }
        else {
            response = await window.ipc.setDns(server);
            if (response.success) {
                setCurrentActive(server.key)
            }
        }

        alert(response.message)


    } catch (e: any) {
        alert(e.message)
    } finally {
        //  setIsLoading(false)
    }
}

