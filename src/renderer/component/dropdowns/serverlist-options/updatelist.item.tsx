import _ from 'lodash';
import axios from 'axios';
import { Dropdown } from 'react-daisyui';
import { RxUpdate } from 'react-icons/rx';
import { useContext, useState } from 'react';

import { serversContext } from '../../../context/servers.context';
import { activityContext } from '../../../context/activty.context';
import { ActivityContext } from '../../../interfaces/activty.interface';
import { Server } from '../../../../shared/interfaces/server.interface';
import { UrlsConstant } from '../../../../shared/constants/urls.constant';
import { ServersContext } from '../../../interfaces/servers-context.interface';
import { useTranslation } from 'react-multi-lang';

const cacheBuster = (url: string) => `${url}?cb=${Date.now()}`;

export function UpdateListItemComponent() {
    const serversContextData: ServersContext = useContext<ServersContext>(serversContext);
    const activityContextData = useContext<ActivityContext>(activityContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const translate = useTranslation();
    async function updateHandler() {
        if (activityContextData.isWaiting)
            return alert('please wait...'); //todo add toast
        try {
            setIsLoading(true);

            activityContextData.setStatus('Retrieving from repository...');
            activityContextData.setIsWaiting(true);

            const response = await axios.get<Server[]>(cacheBuster(UrlsConstant.STORE));
            const servers = serversContextData.servers.concat(response.data);
            const uniqList: Server[] = _.uniqWith(servers, _.isEqual);
            
            serversContextData.setServers(uniqList);
            
            await window.ipc.reloadServerList(uniqList);
        } catch (error) {
            window.ipc.dialogError('fetching error', "Error in receiving data from the repository");
        } finally {
            activityContextData.setIsWaiting(false);
            activityContextData.setStatus('');
            setIsLoading(false);
        }
    }

    return (
        <Dropdown.Item onClick={() => updateHandler()}>
            <RxUpdate
                className={`mr-2 ${isLoading ? 'spinner' : ''}`} />
            {translate("buttons.update")}
        </Dropdown.Item>
    )
}
