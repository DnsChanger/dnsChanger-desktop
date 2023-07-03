import { Server } from "../../shared/interfaces/server.interface";
import { serversContext } from "../context/servers.context";
import { useEffect, useState } from "react";
import { ConnectButtonComponent } from "../component/buttons/connect-btn.component";
import { ServersListSelectComponent } from "../component/selectes/servers";
import { ServerInfoCardComponent } from "../component/cards/server-info";

import { AddCustomBtnComponent } from "../component/buttons/add-custom-btn-component";

export function HomePage() {
  const [serversState, setServers] = useState<Server[]>([]);
  const [currentActive, setCurrentActive] = useState<Server | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [loadingCurrentActive, setLoadingCurrentActive] =
    useState<boolean>(true);
  useEffect(() => {
    async function fetchDnsList() {
      const response = await window.ipc.fetchDnsList();
      setServers(response.servers);
    }

    fetchDnsList();
  }, []);

  useEffect(() => {
    async function getCurrentActive() {
      try {
        const response = await window.ipc.getCurrentActive();
        if (response.success) {
          setCurrentActive(response.server);
          setSelectedServer(response.server);
        }
      } finally {
        setLoadingCurrentActive(false);
      }
    }

    getCurrentActive();
  }, []);

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
              <div className={"absolute right-[50px] top-[100px]"}>
                <div className={"flex flex-col"}>
                  <div
                    className={
                      "absolute bottom-[217px] right-12 flex flex-row gap-1"
                    }
                  >
                    <AddCustomBtnComponent />
                  </div>
                  <div className={"flex-none"}>
                    <ServersListSelectComponent />
                  </div>
                  <ServerInfoCardComponent
                    loadingCurrentActive={loadingCurrentActive}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </serversContext.Provider>
    </div>
  );
}
