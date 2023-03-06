import {Dropdown} from "react-daisyui";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Server} from "../../../../shared/interfaces/server.interface";
import {useContext} from "react";
import {ServersContext} from "../../../interfaces/servers-context.interface";
import {serversContext} from "../../../context/servers.context";

interface Props {
    server: Server
}

export function DeleteItemComponent(props: Props) {
    const server: Server = props.server
    const serversContextData = useContext<ServersContext>(serversContext)

    async function clickHandler() {
        const response = await window.ipc.deleteDns(server)
        if (response.success) {
            window.ipc.notif(`${server.names.fa} با موفقیت از لیست حذف شد.`)
            serversContextData.setServers(response.servers)
        } else {
            window.ipc.notif(response.message)
        }
    }

    return (
        <Dropdown.Item onClick={() => clickHandler()}>
            <FontAwesomeIcon icon={"trash"} color={"#ec2222"}/>
        </Dropdown.Item>
    )
}
