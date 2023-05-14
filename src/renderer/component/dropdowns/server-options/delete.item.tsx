import { useContext } from "react";
import { Dropdown } from "react-daisyui";
import { HiOutlineTrash } from "react-icons/hi";

import { serversContext } from "../../../context/servers.context";
import { Server } from "../../../../shared/interfaces/server.interface";
import { ServersContext } from "../../../interfaces/servers-context.interface";
import { useI18nContext } from "../../../../i18n/i18n-react";

interface Props {
  server: Server;
}

export function DeleteItemComponent(props: Props) {
  const server: Server = props.server;
  const serversContextData = useContext<ServersContext>(serversContext);
  const { LL } = useI18nContext();

  async function clickHandler() {
    const response = await window.ipc.deleteDns(server);

    if (response.success) {
      window.ipc.notif(
        LL.dialogs.removed_server({ serverName: server.names.eng })
      );
      serversContextData.setServers(response.servers);
    } else {
      window.ipc.notif(response.message);
    }
  }

  return (
    <Dropdown.Item onClick={() => clickHandler()}>
      <HiOutlineTrash color={"#ec2222"} />
    </Dropdown.Item>
  );
}
