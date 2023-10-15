import {
  Server,
  ServerStore,
} from "../../../../shared/interfaces/server.interface";
import React, { useContext } from "react";
import { serversContext } from "../../../context/servers.context";
import { ServersContext } from "../../../interfaces/servers-context.interface";
import { Select } from "react-daisyui";

export function ServersListSelectComponent() {
  const serversStateContext = useContext(serversContext);
  const selectedDef =
    serversStateContext.selected?.key == "unknown" ||
    !serversStateContext.selected;
  function onChange(key: string) {
    const server = serversStateContext.servers.find((ser) => ser.key == key);
    serversStateContext.setSelected(server);
  }
  return (
    <Select
      className={
        "w-[360px] dark:bg-[#262626] bg-base-200 text-[#6B6A6A] border-none rounded-[23px]"
      }
      borderOffset={true}
      onChange={(data) => onChange(data.target.value)}
    >
      <Select.Option value={"default"} selected={selectedDef} disabled={true}>
        Pick your favorite Server
      </Select.Option>
      {servers(serversStateContext)}
    </Select>
  );
}

function servers(serversStateContext: ServersContext): any {
  const pinsServers = serversStateContext.servers.filter((ser) => ser.isPin);

  const renderServer = (server: ServerStore) => {
    const isConnect = serversStateContext.currentActive?.key === server.key;
    return (
      <Select.Option
        key={server.key}
        value={server.key}
        selected={server.key === serversStateContext.selected?.key}
      >
        {isConnect ? "🟢" : "🔴"} {server.name}
      </Select.Option>
    );
  };

  const pins = pinsServers.map(renderServer);

  if (pins.length > 0) {
    pins.unshift(
      <Select.Option
        key=""
        value=""
        disabled={true}
        className="text-center bg-gray-300 text-gray-600 dark:bg-[#262626] dark:text-gray-500 mt-5"
      >
        Pins
      </Select.Option>
    );
  }

  const allServers = serversStateContext.servers.filter((ser) => !ser.isPin);
  const all = allServers.map(renderServer);
  all.unshift(
    <Select.Option
      key=""
      value=""
      disabled={true}
      className="text-center bg-gray-300 text-gray-600 dark:bg-[#262626] dark:text-gray-500"
    >
      All
    </Select.Option>
  );

  return [...pins, ...all];
}
