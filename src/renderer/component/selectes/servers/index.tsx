import { Select } from "react-daisyui";

// eslint-disable-next-line import/no-unresolved
import { Server } from "@/shared/interfaces/server.interface";
import { useContext, useEffect, useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { serversContext } from "@/renderer/context/servers.context";
import { ServersContext } from "@/renderer/interfaces/servers-context.interface";

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
      className={
        "w-[350px] dark:bg-[#262626] bg-base-200 text-[#6B6A6A] border-none"
      }
      disabled={!!serversStateContext.currentActive}
      borderOffset={true}
      onChange={(data) => setSelectedKey(data.target.value)}
    >
      <Select.Option
        value={"default"}
        selected={true}
        disabled={true}
        defaultValue={"default"}
      >
        Pick your favorite Server
      </Select.Option>
      {servers(serversStateContext)}
    </Select>
  );
}

function servers(serversStateContext: ServersContext): any {
  return serversStateContext.servers.map((server: Server) => {
    return (
      <Select.Option
        key={server.key}
        value={server.key}
        selected={server.key == serversStateContext.currentActive?.key}
      >
        {server.name}
      </Select.Option>
    );
  });
}
