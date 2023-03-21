import 'react-daisyui';
import React, { useContext } from 'react';
import { ServerComponent } from './server.component';

import { setState } from '../../interfaces/react.interface';
import { serversContext } from '../../context/servers.context';
import { Server } from '../../../shared/interfaces/server.interface';
import { ServersContext } from '../../interfaces/servers-context.interface';

interface Props {
    currentActive: Server
    setCurrentActive: setState<Server>
}

export function ServersComponent(props: Props) {
    const serversContextData = useContext<ServersContext>(serversContext);
    
    return (
        <div>
            {
                serversContextData.servers.map((server) =>
                    <ServerComponent
                        server={server} currentActive={props.currentActive}
                        setCurrentActive={props.setCurrentActive}
                        key={server.key}
                    />
                )
            }
        </div>
    )
}
