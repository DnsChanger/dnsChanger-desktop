import React from 'react';
import { TbServer2 } from 'react-icons/tb';
import { Button, Tooltip } from 'react-daisyui';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { BsFillStopCircleFill } from 'react-icons/bs';

import { setState } from '../../interfaces/react.interface';
import { activityContext } from '../../context/activty.context';
import { ActivityContext } from '../../interfaces/activty.interface';
import { Server } from '../../../shared/interfaces/server.interface';
import { ServerOptionsComponent } from '../dropdowns/server-options/server-options.component';

interface Props {
    server: Server
    currentActive: Server,
    setCurrentActive: setState<Server>
}

export function ServerComponent(prop: Props) {


    const server = prop.server;
    const isConnect = server.key == prop.currentActive?.key;
    const activityContextData = React.useContext<ActivityContext>(activityContext);

    // @ts-ignore
    const serverName = server.names.eng

    return (
        <div dir='ltr' className='mb-2 p-2 border rounded border-gray-500 border-dashed'>
            <div className='flex flex-nowrap' dir='auto'>
                <div className='flex-none'>
                    <TbServer2 size={25} />
                </div>
                <div className='flex-1 w-20'>
                    <Tooltip message={server.servers.join('\n')} position={'bottom'}>
                        <p className={'font-medium'} >{serverName}</p>
                    </Tooltip>
                </div>
                <div className={'flex flex-row gap-2'}>

                    <div>
                        <Button shape='circle' size='xs' color={isConnect ? 'success' : 'warning'}
                            disabled={activityContextData.isWaiting}
                            onClick={() => clickHandler.apply(activityContextData, [server, prop.setCurrentActive, isConnect])}
                        >
                            {isConnect ? <BsFillStopCircleFill /> : <AiOutlinePoweroff />}
                        </Button>
                    </div>
                    <div>
                        <ServerOptionsComponent server={server} />
                    </div>
                </div>
            </div>
        </div>
    )
}


async function clickHandler(server: Server, setCurrentActive: setState<Server | null>, isConnect: boolean) {
    const activityContextData = this as ActivityContext;

    try {
        if (activityContextData.isWaiting) {
            window.ipc.notif('Please wait until the previous request is finished.');
            return;
        }

        activityContextData.setIsWaiting(true);

        let response;

        if (isConnect) {
            activityContextData.setStatus('A moment...');

            response = await window.ipc.clearDns();
            response.success && setCurrentActive(null);
        } else {
            activityContextData.setStatus('Connecting...');

            response = await window.ipc.setDns(server);

            if (response.success)
                setCurrentActive(server);
        }
        if (response.success)
            window.ipc.notif(response.message);
        else
            throw response;

    } catch (e) {
        window.ipc.dialogError('Error', e.message);
    } finally {
        activityContextData.setIsWaiting(false);
        activityContextData.setStatus('');
    }
}

