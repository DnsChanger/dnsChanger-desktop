import {
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from "react-icons/md";
import { Avatar, Badge, Button } from "react-daisyui";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiCopy } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { serversContext } from "@/renderer/context/servers.context";
import { Server } from "@/shared/interfaces/server.interface";

import { useI18nContext } from "@/i18n/i18n-react";

interface Prop {
  loadingCurrentActive: boolean;
}

export function ServerInfoCardComponent(prop: Prop) {
  const serversStateContext = useContext(serversContext);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [ping, setPing] = useState<number>();
  const { LL } = useI18nContext();
  useEffect(() => {
    if (serversStateContext.selected) {
      setSelectedServer(serversStateContext.selected);
      setPing(0);
      window.ipc
        .ping(serversStateContext.selected)
        .then((res) => res.success && setPing(res.data.time));
    } else setSelectedServer(null);
  }, [serversStateContext.selected]);

  if (!selectedServer) {
    return (
      <div
        className={
          "dark:bg-[#262626] bg-base-200 h-[189px] w-[362px] mt-5 rounded-[23px]"
        }
      >
        <div className={"absolute left-[90px] top-[110px] flex flex-col gap-2"}>
          <div className={"flex flex-rows gap-2"}>
            <Avatar src={"assets/icon.png"} size={"xs"} className={"mb-2"} />
            <h1 className={"text-2xl mt-1 font-[balooTamma] text-[#7487FF]"}>
              {LL.pages.home.homeTitle()}
            </h1>
          </div>
          <hr className={"border-t-2 border-[#A8A8A8] dark:border-[#323232]"} />
          <div className={"flex flex-rows gap-2 justify-center"}>
            {prop.loadingCurrentActive ? (
              <div className={"flex flex-rows gap-2"}>
                <AiOutlineLoading3Quarters className={"spinner mt-1"} />
                <span className={"text-[#7B7B7B]"}>fetch curren active...</span>
              </div>
            ) : (
              <span></span>
            )}
          </div>
          <span className={"text-[#787878] text-sm"}>
            {LL.version()} {import.meta.env.VITE_VERSION}
          </span>
        </div>
      </div>
    );
  }

  const isConnect =
    serversStateContext.currentActive?.key == selectedServer.key;
  return (
    <div className="dark:bg-[#262626] bg-base-200 h-[189px] w-[362px] mt-5 rounded-[23px]">
      <div
        className={
          "grid grid-cols-2 gap-4 mt-5 text-[#434343] dark:text-[#A6A6A6]"
        }
      >
        <div className={"flex flex-col gap-2"}>
          <h3 className={"font-semibold text-gray-500"}>Name</h3>

          <div
            className={"w-100 text-center flex flex-row gap-2 justify-center"}
          >
            <img
              src={`/assets/servers-icon/${selectedServer.avatar}`}
              alt=""
              className="self-center w-5 h-5 rounded-full mr-1"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "/assets/servers-icon/def.png";
              }}
            />
            <span className="ml-1 inline-flex items-baseline text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-200 text-center">
                {selectedServer.names.eng}
              </span>
            </span>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-semibold text-gray-500"}>Ping</h3>

          <div
            className={"w-100 flex flex-row gap-1   justify-center text-center"}
          >
            {ping > 0 && getPingIcon(ping)}
            <span className="ml-1 inline-flex items-baseline text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {ping}
              </span>
            </span>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-semibold text-gray-500"}>Address</h3>
          <div
            className={"w-100 flex flex-row gap-2   justify-center text-center"}
          >
            <span className="ml-1 inline-flex items-baseline text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {selectedServer.servers[0] + "..."}
              </span>
            </span>
            <Button
              shape={"circle"}
              size={"xs"}
              className={
                "bg-[#434343] dark:bg-[#fffff] dark:bg-gray-800  hover:bg-gray-900 active:bg-green-400  border-none"
              }
              onClick={() =>
                navigator.clipboard.writeText(selectedServer.servers.join(","))
              }
            >
              <FiCopy />
            </Button>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-semibold  text-gray-500"}>Status</h3>

          <div
            className={"w-100 flex flex-row gap-1   justify-center text-center"}
          >
            {
              <Badge
                className={"mt-1"}
                color={isConnect ? "success" : "error"}
                size={"xs"}
              ></Badge>
            }
            <span className="ml-1 inline-flex items-baseline text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {isConnect ? "Connected" : "Disconnect"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPingIcon(ping: number): JSX.Element {
  switch (true) {
    case ping <= 100:
      return <MdOutlineSignalCellularAlt className={"mt-0.5 text-[#40CF4E]"} />;
    case ping <= 180:
      return (
        <MdOutlineSignalCellularAlt2Bar className={"mt-0.5 text-[#A6893F]"} />
      );
    default:
      return (
        <MdOutlineSignalCellularAlt1Bar className={"mt-0.5 text-[#A63F3F]"} />
      );
  }
}
