import {
  MdOutlineAddModerator,
  MdOutlineSignalCellularAlt,
  MdOutlineSignalCellularAlt1Bar,
  MdOutlineSignalCellularAlt2Bar,
} from "react-icons/md";
import { Avatar, Button } from "react-daisyui";
import { TfiReload } from "react-icons/tfi";
import { FiCopy } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { serversContext } from "@/renderer/context/servers.context";
import { Server } from "@/shared/interfaces/server.interface";
import { UpdateListBtnComponent } from "@/renderer/component/buttons/updateList-btn.component";
import { AddCustomBtnComponent } from "@/renderer/component/buttons/add-custom-btn-component";
import { useI18nContext } from "@/i18n/i18n-react";

export function ServerInfoCardComponent() {
  const serversStateContext = useContext(serversContext);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [ping, setPing] = useState<number>(0);
  const { LL } = useI18nContext();
  useEffect(() => {
    if (serversStateContext.selected) {
      setSelectedServer(serversStateContext.selected);
      window.ipc
        .ping(serversStateContext.selected)
        .then((res) => res.success && setPing(res.data.time));
    }
  }, [serversStateContext.selected]);

  if (!selectedServer) {
    return (
      <div className={"bg-[#262626] h-[189px] w-[362px] mt-5 rounded-[23px]"}>
        <div
          className={"absolute left-[120px] top-[140px] flex flex-row gap-2"}
        >
          <Avatar src={"assets/icon.png"} size={"xs"} className={"mb-2"} />
          <h1 className={"text-1xl mt-1"}>{LL.pages.home.homeTitle()}</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#262626] h-[189px] w-[362px] mt-5 rounded-[23px]">
      <div className={"grid grid-cols-2 gap-4 mt-5"}>
        <div className={"flex flex-col gap-2"}>
          <h3 className={"font-bold"}>Name</h3>

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
          <h3 className={"font-bold"}>Ping</h3>

          <div
            className={"w-100 flex flex-row gap-1   justify-center text-center"}
          >
            {ping && getPingIcon(ping)}
            <span className="ml-1 inline-flex items-baseline text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-200">
                {ping}
              </span>
            </span>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-bold"}>Address</h3>

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
                "bg-gray-800 hover:bg-gray-900 active:bg-green-400  border-none"
              }
              onClick={() =>
                navigator.clipboard.writeText(selectedServer.servers.join(","))
              }
            >
              <FiCopy />
            </Button>
          </div>
        </div>
      </div>
      {/*<div className={"absolute top-[220px] ml-5 flex flex-row gap-1"}>*/}
      {/*  <UpdateListBtnComponent*/}
      {/*    servers={serversStateContext.servers}*/}
      {/*    setServers={serversStateContext.setServers}*/}
      {/*  />*/}
      {/*  <AddCustomBtnComponent />*/}
      {/*</div>*/}
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
