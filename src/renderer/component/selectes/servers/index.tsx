import { Select } from "react-daisyui";

// eslint-disable-next-line import/no-unresolved
import { Server } from "@/shared/interfaces/server.interface";
import { useContext, useEffect, useState } from "react";
import { serversContext } from "@/renderer/context/servers.context";

export function ServersListSelectComponent() {
  const serversStateContext = useContext(serversContext);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (selectedKey && serversStateContext.servers.length) {
      const server = serversStateContext.servers.find(
        (ser) => ser.key == selectedKey
      );
      if (server) {
        serversStateContext.setSelected(server);
      }
    }
  }, [selectedKey]);

  return (
    <Select
      className={"w-[350px] bg-[#262626]"}
      onChange={(data) => setSelectedKey(data.target.value)}
    >
      <Select.Option value={"default"} disabled={true} selected={true}>
        Pick your favorite Server
      </Select.Option>

      {serversStateContext.servers.map((server: Server) => {
        return (
          <Select.Option value={server.key}>{server.names.eng}</Select.Option>
        );
      })}
    </Select>
  );
}
