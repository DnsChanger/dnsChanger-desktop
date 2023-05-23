import React, { useEffect } from "react";
import { Tooltip } from "react-daisyui";
import { AiOutlineCloudServer } from "react-icons/ai";

import { setState } from "../../interfaces/react.interface";
import { activityContext } from "../../context/activty.context";
import { ActivityContext } from "../../interfaces/activty.interface";
import { Server } from "../../../shared/interfaces/server.interface";
import { ServerOptionsComponent } from "../dropdowns/server-options/server-options.component";
import { useI18nContext } from "../../../i18n/i18n-react";
import { useState } from "react";

interface Props {
  server: Server;
  currentActive: Server;
  setCurrentActive: setState<Server>;
}

export function ServerComponent(prop: Props) {
  const { LL, locale } = useI18nContext();
  const server = prop.server;
  const isConnect = server.key == prop.currentActive?.key;
  const activityContextData =
    React.useContext<ActivityContext>(activityContext);
  const setCurrentActive: setState<Server | null> = prop.setCurrentActive;
  const currentActive: Server = prop.currentActive;
  const [connecting, setConnecting] = useState<boolean>(false);
  const [currentPing, setPing] = useState<number>(0);

  // @ts-ignore
  const serverName = server.names[locale] || server.names.eng;

  async function clickHandler() {
    try {
      if (activityContextData.isWaiting) {
        window.ipc.notif(LL.waiting());
        return;
      }

      activityContextData.setIsWaiting(true);

      let response;

      if (isConnect) {
        activityContextData.setStatus(LL.disconnecting());

        response = await window.ipc.clearDns();
        response.success && setCurrentActive(null);
      } else {
        setConnecting(true);
        activityContextData.setStatus(LL.connecting());

        response = await window.ipc.setDns(server);

        if (response.success) setCurrentActive(server);
      }
      if (!response.success) throw response;

      setConnecting(false);
      window.ipc.notif(response.message);
    } catch (e) {
      window.ipc.dialogError("Error", e.message);
    } finally {
      activityContextData.setIsWaiting(false);
      activityContextData.setStatus("");
      setConnecting(false);
    }
  }

  useEffect(() => {
    if (typeof activityContextData.reqPing == "boolean") {
      window.ipc
        .ping(server)
        .then((res) => res.success && setPing(res.data.time));
    }
  }, [activityContextData.reqPing]);

  return (
    <div>
      <div
        className={`py-6 border-l-2 border-r-2 rounded-lg shadow-md mb-2 mt-1  ${
          isConnect
            ? "dark:shadow-green-500/20 shadow-teal-300/20"
            : "drop-shadow-lg"
        }
             border-gray-400 dark:border-gray-600
                ${
                  isConnect
                    ? "bg-green-500 text-white  hover:bg-red-500 hover:shadow-none"
                    : "hover:bg-green-500 text-accent-content"
                }
                ${
                  activityContextData.isWaiting && isConnect
                    ? "bg-red-400 animate-pulse shadow-none"
                    : ""
                }
                ${
                  activityContextData.isWaiting && connecting
                    ? "bg-green-400 animate-pulse"
                    : ""
                }
                overflow-y-hidden
            `}
      >
        <div className="flex flex-nowrap ">
          <div
            className="flex-none ml-2 relative"
            onClick={() => !activityContextData.isWaiting && clickHandler()}
          >
            {typeof activityContextData.reqPing == "boolean" &&
            Number(currentPing) ? (
              <div
                className={`absolute top-1/2 text-left -translate-y-1/2 -right-10 border-1 w-20 h-10 rounded-3xl bg-opacity-80 ${getColor(
                  currentPing
                )}`}
              >
                <div
                  className="w-1/2 grid place-items-center ml-auto"
                  style={{ textAlign: "initial" }}
                >
                  <code className={`leading-10 `}>
                    {currentPing > 500 ? "500+" : currentPing}
                  </code>
                </div>
              </div>
            ) : (
              <div
                className={`absolute top-1/2 text-left -translate-y-1/2 -right-10 border-1 w-20 h-10 rounded-3xl bg-opacity-80 ${getColor(
                  currentPing
                )}`}
              >
                <div
                  className="w-1/2 grid place-items-center ml-auto"
                  style={{ textAlign: "initial" }}
                >
                  <AiOutlineCloudServer
                    size={25}
                    className={`leading-10 mt-2 mr-5`}
                  />
                </div>
              </div>
            )}
          </div>
          <div
            className="flex-1 w-20 cursor-pointer"
            onClick={() => !activityContextData.isWaiting && clickHandler()}
          >
            <Tooltip
              message={isConnect ? LL.help_disconnect() : LL.help_connect()}
              position={"bottom"}
            >
              <p className={"font-medium"}>{serverName}</p>
            </Tooltip>
          </div>
          <div className="flex-none w-14">
            <div>
              <ServerOptionsComponent server={server} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getColor(ping: number): string {
  switch (true) {
    case ping <= 100:
      return "bg-teal-900/50";
    case ping <= 180:
      return "bg-yellow-300/50";
    default:
      return "bg-red-900/40";
  }
}
