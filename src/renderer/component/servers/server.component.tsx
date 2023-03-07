import React, { } from 'react';
import { Badge, Button, Dropdown, Tooltip } from 'react-daisyui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setState } from '../../interfaces/react.interface';
import { activityContext } from '../../context/activty.context';
import { ActivityContext } from '../../interfaces/activty.interface';
import { Server } from "../../../shared/interfaces/server.interface";
import { ServerOptionsComponent } from "../dropdowns/server-options/server-options.component";

interface Props {
    server: Server
    currentActive: Server,
    setCurrentActive: setState<Server>
}

export function ServerComponent(prop: Props) {
    const server = prop.server
    const isConnect = server.key == prop.currentActive?.key
    const activityContextData = React.useContext<ActivityContext>(activityContext);
    return (
        <div dir='ltr' className='mb-2 p-2'>
            <div className="flex flex-nowrap">
                <div className='flex-none'>
                    <FontAwesomeIcon icon={"server"} />
                </div>
                <div className='flex-1 w-20'>
                    <Tooltip message={server.servers.join("\n")} position={"bottom"}>
                        <p className={"font-medium"} >{server.names.eng}</p>
                    </Tooltip>
                </div>
                <div className={"flex flex-row gap-2"}>

                    <div>
                        <Button shape='circle' size='xs' color={isConnect ? 'success' : 'warning'}
                            disabled={activityContextData.isWaiting}
                            onClick={() => clickHandler.apply(activityContextData, [server, prop.setCurrentActive, isConnect])}
                        >
                            <FontAwesomeIcon icon={isConnect ? 'stop' : "power-off"} />
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
    const activityContextData = this as ActivityContext

    try {
        if (activityContextData.isWaiting) {
            window.ipc.notif("لطفا تا پایان درخواست قبلی صبر کنید.")
            return;
        }
        activityContextData.setIsWaiting(true)
        let response;
        if (isConnect) {
            activityContextData.setStatus("یک لحظه...")
            response = await window.ipc.clearDns();
            response.success && setCurrentActive(null)
        } else {
            activityContextData.setStatus("درحال اتصال....")
            response = await window.ipc.setDns(server);
            if (response.success) {
                setCurrentActive(server)
            }
        }
        if (response.success)
            window.ipc.notif(response.message)
        else
            throw response

    } catch (e: any) {
        window.ipc.dialogError("Error", e.message)
    } finally {
        activityContextData.setIsWaiting(false)
        activityContextData.setStatus("")
        //  setIsLoading(false)
    }
}

