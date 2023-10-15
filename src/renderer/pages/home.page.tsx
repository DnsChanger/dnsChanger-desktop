import { Server, ServerStore } from "../../shared/interfaces/server.interface";
import { serversContext } from "../context/servers.context";
import { useEffect, useState } from "react";
import { ConnectButtonComponent } from "../component/buttons/connect-btn.component";
import { ServersListSelectComponent } from "../component/selectes/servers";
import { ServerInfoCardComponent } from "../component/cards/server-info";
import { AddCustomBtnComponent } from "../component/buttons/add-custom-btn-component";
import { DeleteButtonComponent } from "../component/buttons/delete-btn.component";
import { InterfacesDialogButtonComponent } from "../component/buttons/interfaces-dialog-btn-component";
import { ToggleButtonComponent } from "../component/buttons/togglePin-btn.component";

export function HomePage() {
  const [serversState, setServers] = useState<ServerStore[]>([]);
  const [currentActive, setCurrentActive] = useState<ServerStore | null>(null);
  const [network, setNetwork] = useState<string>();
  const [selectedServer, setSelectedServer] = useState<ServerStore | null>(
    null
  );
  const [loadingCurrentActive, setLoadingCurrentActive] =
    useState<boolean>(true);
  const osType = window.os.os;
  useEffect(() => {
    async function fetchDnsList() {
      const response = await window.ipc.fetchDnsList();
      setServers(response.servers);
    }

    fetchDnsList();
  }, []);

  useEffect(() => {
    async function getCurrentActive() {
      if (!network) {
        setNetwork(window.storePreload.get("settings").network_interface);
        return;
      }
      try {
        setSelectedServer(null);
        const response = await window.ipc.getCurrentActive();
        setCurrentActive(response.server);
        setSelectedServer(response.server);
      } finally {
        setLoadingCurrentActive(false);
      }
    }

    getCurrentActive();
  }, [network]);

  return (
    <div className="container">
      <serversContext.Provider
        value={{
          servers: serversState,
          setServers: setServers,
          currentActive: currentActive,
          setCurrentActive,
          selected: selectedServer,
          setSelected: setSelectedServer,
          network: network,
          setNetwork: setNetwork,
        }}
      >
        <div className="px-0 sm:p-4 hero-content text-center max-w-[500px]   mb-1 ">
          <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
            <div className={"flex flex-row gap-10"}>
              <div className={"absolute right-[550px] flex-grow-0"}>
                <div className={"flex flex-col"}>
                  <ConnectButtonComponent />
                </div>
              </div>

              <div className={"absolute right-[50px] top-[90px]"}>
                <div className={"flex flex-col"}>
                  <div className={"flex-none"}>
                    <ServersListSelectComponent />
                  </div>
                  <ServerInfoCardComponent
                    loadingCurrentActive={loadingCurrentActive}
                  />
                </div>
                <div
                  className={
                    "absolute bottom-[216px] right-10 flex flex-row-reverse gap-2"
                  }
                >
                  <AddCustomBtnComponent />
                  {osType == "win32" && <InterfacesDialogButtonComponent />}
                </div>
              </div>
              <div
                className={
                  "absolute top-[330px] left-[360px] grid grid-cols-10 gap-10"
                }
              >
                <DeleteButtonComponent />
                <ToggleButtonComponent />
                {/*<EditButtonComponent />*/}
              </div>
            </div>
          </div>
        </div>
      </serversContext.Provider>
    </div>
  );
}
