import "react-daisyui";
import React, { useContext } from "react";
import { ServerComponent } from "./server.component";
import { serversContext } from "../../context/servers.context";
import { ServersContext } from "../../interfaces/servers-context.interface";

interface Props {}

export function ServersComponent(props: Props) {
  const serversContextData = useContext<ServersContext>(serversContext);

  return (
    <div>
      {serversContextData.servers.map((server) => (
        <ServerComponent
          server={server}
          currentActive={serversContextData.currentActive}
          setCurrentActive={serversContextData.setCurrentActive}
          key={server.key}
        />
      ))}
    </div>
  );
}
