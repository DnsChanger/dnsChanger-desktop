import { Dropdown } from 'react-daisyui';
import { useContext, useState } from 'react';
import { ActivityContext } from '../../../interfaces/activty.interface';
import { activityContext } from '../../../context/activty.context';
import axios from 'axios';
import { Server } from '../../../../shared/interfaces/server.interface';
import _ from 'lodash';
import { ServersContext } from '../../../interfaces/servers-context.interface';
import { serversContext } from '../../../context/servers.context';
import { UrlsConstant } from '../../../../shared/constants/urls.constant';
import { RxUpdate } from "react-icons/rx"

const cacheBuster = (url: string) => `${url}?cb=${Date.now()}`;

export function UpdateListItemComponent() {
    const serversContextData: ServersContext = useContext<ServersContext>(serversContext);
    const activityContextData = useContext<ActivityContext>(activityContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function updateHandler() {
        if (activityContextData.isWaiting)
            return alert("لطفا صبر کنید..."); //todo add toast

        try {

            setIsLoading(true)

            activityContextData.setStatus("در حال دریافت از مخزن...")

            activityContextData.setIsWaiting(true)

            const response = await axios.get<Server[]>(cacheBuster(UrlsConstant.STORE))
            const servers = serversContextData.servers.concat(response.data);
            const uniqList: Server[] = _.uniqWith(servers, _.isEqual)
            serversContextData.setServers(uniqList)
            await window.ipc.reloadServerList(uniqList)
        } catch (error) {
            window.ipc.dialogError("fetching error", "خطا در دریافت دیتا از مخزن")
        } finally {
            activityContextData.setIsWaiting(false)
            activityContextData.setStatus("")
            setIsLoading(false)
        }
    }

    return (
        <Dropdown.Item onClick={() => updateHandler()}>
            <RxUpdate
                className={`mr-2 ${isLoading ? "spinner" : ""}`} />
            بروزرسانی لیست
        </Dropdown.Item>
    )
}
