import { Server } from "../../../../shared/interfaces/server.interface";
import React, { useContext, useEffect, useState } from "react";
import { serversContext } from "../../../context/servers.context";
import { ServersContext } from "../../../interfaces/servers-context.interface";
import { Select } from "react-daisyui";

export function ServersListSelectComponent() {
  const serversStateContext = useContext(serversContext);
  const [selectedKey, setSelectedKey] = useState<string | undefined>("default");
  useEffect(() => {
    if (selectedKey != "default" && serversStateContext.servers.length) {
      const server = serversStateContext.servers.find(
        (ser) => ser.key == selectedKey
      );
      if (server) {
        serversStateContext.setSelected(server);
      }
    } else {
    }
  }, [selectedKey]);

  return (
    <Select
      className={
        "w-[350px] dark:bg-[#262626] bg-base-200 text-[#6B6A6A] border-none"
      }
      // disabled={!!serversStateContext.currentActive}
      borderOffset={true}
      onChange={(data) => setSelectedKey(data.target.value)}
    >
      <Select.Option
        value={"default"}
        selected={selectedKey == "default"}
        disabled={true}
      >
        Pick your favorite Server
      </Select.Option>
      {servers(serversStateContext)}
    </Select>
  );
}

function servers(serversStateContext: ServersContext): any {
  return serversStateContext.servers.map((server: Server) => {
    const isConnect = serversStateContext.currentActive?.key == server.key;
    return (
      <Select.Option
        key={server.key}
        value={server.key}
        selected={server.key == serversStateContext.selected?.key}
      >
        {isConnect ? "🟢" : "🔴"} {server.name}
      </Select.Option>
    );
  });
}
