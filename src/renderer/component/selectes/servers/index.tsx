import { Select } from "react-daisyui";

// eslint-disable-next-line import/no-unresolved
import { Server } from "@/shared/interfaces/server.interface";
import { useContext, useEffect, useState } from "react";
// eslint-disable-next-line import/no-unresolved
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
      className={
        "w-[350px] dark:bg-[#262626] bg-base-200 text-[#6B6A6A] border-none"
      }
      disabled={!!serversStateContext.currentActive}
      borderOffset={true}
      onChange={(data) => setSelectedKey(data.target.value)}
    >
      <Select.Option value={"default"} disabled={true} defaultValue={"default"}>
        Pick your favorite Server
      </Select.Option>

      {serversStateContext.servers.map((server: Server) => {
        return (
          <Select.Option
            value={server.key}
            defaultValue={
              server.key == serversStateContext.currentActive?.key
                ? server.key
                : null
            }
          >
            {server.names.eng}
          </Select.Option>
        );
      })}
    </Select>
  );
}