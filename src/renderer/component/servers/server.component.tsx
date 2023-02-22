
import { Button } from 'react-daisyui';
import { Server } from '../../../constants/servers.cosntant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setState } from '../../../renderer/interfaces/react.interface';
import React, { useState } from 'react';
import { activityContext } from '../../context/activty.context';
import { ActivityContext } from '../../interfaces/activty.interface';
interface Props {
    server: Server
    currentActive: string,
    setCurrentActive: setState<string>
}

export function ServerComponent(prop: Props) {
    const server = prop.server
    const isConnect = server.key == prop.currentActive
    const activityContextData = React.useContext<ActivityContext>(activityContext);
    return (
        <div dir='auto' className=' mb-2 p-2'>
            <div className="flex flex-nowrap">
                <div className='flex-none'>
                    <FontAwesomeIcon icon={"server"} />
                </div>
                <div className='flex-1 w-64'>{server.names.eng}</div>
                <div>
                    <Button shape='circle' size='sm' color={isConnect ? 'success' : 'warning'}
                        onClick={(e) => clickHandler.apply(activityContextData, [server, prop.setCurrentActive, isConnect])}
                    >
                        <FontAwesomeIcon icon={isConnect ? 'stop' : "power-off"} />
                    </Button>
                </div>
            </div>
        </div>
    )
}


async function clickHandler(server: Server, setCurrentActive: setState<string>, isConnect: boolean) {
    const activityContextData = this as ActivityContext
    try {
        if (activityContextData.isWaiting) {
            alert("لطفا تا پایان درخواست قبلی صبر کنید.")
            return;
        }
        activityContextData.setIsWaiting(true)
        let response;
        if (isConnect) {
            activityContextData.setStatus("یک لحظه...")
            response = await window.ipc.clearDns();
            response.success && setCurrentActive('')
        }
        else {
            activityContextData.setStatus("درحال اتصال....")
            response = await window.ipc.setDns(server);
            if (response.success) {
                setCurrentActive(server.key)
            }
        }

        alert(response.message)


    } catch (e: any) {
        alert(e.message)
    } finally {
        activityContextData.setIsWaiting(false)
        activityContextData.setStatus("")
        //  setIsLoading(false)
    }
}

