import { Avatar, Button } from "react-daisyui";
import { FiCopy } from "react-icons/fi";
import { TfiReload } from "react-icons/tfi";
import { useContext, useEffect, useState } from "react";
import { serversContext } from "../../../context/servers.context";
import { useI18nContext } from "../../../../i18n/i18n-react";
import icon from "../../../../../public/icons/icon.png";
import { getPingIcon } from "../../../utils/icons.util";
import { Chip } from "@material-tailwind/react";
interface Prop {
  loadingCurrentActive: boolean;
}

export function ServerInfoCardComponent(prop: Prop) {
  const serversStateContext = useContext(serversContext);
  const [isCopyAdds, setIsCopyAdds] = useState<boolean>(true);
  const [ping, setPing] = useState<number>();
  const { LL } = useI18nContext();

  useEffect(() => {
    if (isCopyAdds) {
      setTimeout(() => {
        setIsCopyAdds(false);
      }, 700);
    }
  }, [isCopyAdds]);

  useEffect(() => {
    if (serversStateContext.selected) getPing();
  }, [serversStateContext.selected, serversStateContext.currentActive]);

  function getPing() {
    setPing(0);
    window.ipc
      .ping(serversStateContext.selected)
      .then((res) => res.success && setPing(res.data.time));
  }
  if (!serversStateContext.selected) {
    return (
      <div
        className={
          "dark:bg-[#262626] bg-base-200 h-[189px] w-[362px] mt-5 rounded-[23px]"
        }
      >
        <div className={"absolute left-[90px] top-[110px] flex flex-col gap-2"}>
          <div className={"flex flex-rows gap-2"}>
            <Avatar src={icon} size={"xs"} className={"mb-2"} />
            <h1 className={"text-2xl mt-1 font-[balooTamma] text-[#7487FF]"}>
              {LL.pages.home.homeTitle()}
            </h1>
          </div>
          <hr className={"border-t-2 border-[#A8A8A8] dark:border-[#323232]"} />
          <div className={"flex flex-rows gap-2 justify-center"}>
            {prop.loadingCurrentActive ? (
              <div className={"flex flex-rows gap-2"}>
                <span className="loading loading-ring loading-xs"></span>
                <span className={"text-[#7B7B7B]"}>
                  fetch current active...
                </span>
              </div>
            ) : (
              <span></span>
            )}
          </div>
          <span className={"text-[#787878] text-sm"}>
            {LL.version()} {import.meta.env.PACKAGE_VERSION}
          </span>
        </div>
      </div>
    );
  }
  const isConnect =
    serversStateContext.currentActive?.key == serversStateContext.selected.key;
  const name =
    serversStateContext.selected.name?.length > 14
      ? serversStateContext.selected.name.slice(0, 12) + "..."
      : serversStateContext.selected.name;

  const network =
    serversStateContext.network?.length > 14
      ? serversStateContext.network.slice(0, 12) + "..."
      : serversStateContext.network;

  return (
    <div className="dark:bg-[#262626] bg-base-200 h-[189px] w-[362px] mt-5 rounded-[23px]">
      <div
        className={
          "grid grid-cols-2 gap-4 mt-5 text-[#434343] dark:text-[#A6A6A6] "
        }
      >
        <div className={"flex flex-col gap-2"}>
          <h3 className={"font-semibold text-gray-500"}>Name</h3>

          <div
            className={"w-100 text-center flex flex-row gap-2 justify-center"}
          >
            <div className="flex items-center gap-3 p-2 rounded-[10px] dark:bg-gray-900 bg-gray-300">
              <img
                src={`./servers-icon/${serversStateContext.selected.avatar}`}
                alt=""
                className="self-center w-5 h-5 rounded-full mr-1"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = "./servers-icon/def.png";
                }}
              />
              <span className="ml-1 inline-flex items-baseline text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-200 ">
                  {name || "Unknown"}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-semibold text-gray-500"}>Ping</h3>

          <div
            className={"w-100 flex flex-row gap-1   justify-center text-center"}
          >
            <Button
              color="ghost"
              size="sm"
              className="flex items-center gap-3  border-1 border-gray-300 dark:border-gray-900 bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:border-none"
              onClick={getPing}
            >
              {ping > 0 && getPingIcon(ping)}
              <span className="ml-1 inline-flex items-baseline text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-200">
                  {ping}
                </span>
              </span>
              <TfiReload />
            </Button>
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          <h3 className={"font-semibold text-gray-500"}>Address</h3>
          <div
            className={"w-100 flex flex-row gap-2   justify-center text-center"}
          >
            {isCopyAdds ? (
              <Button
                color="success"
                size="sm"
                className="flex items-center gap-3"
              >
                <span className="ml-1 inline-flex items-baseline text-sm">
                  <span className="font-medium text-slate-900 dark:text-slate-200 normal-case">
                    Copied!
                  </span>
                </span>
              </Button>
            ) : (
              <Button
                color="ghost"
                size="sm"
                className="flex items-center gap-3  border-1 border-gray-300 dark:border-gray-900 bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:border-none"
                onClick={() => {
                  navigator.clipboard.writeText(
                    serversStateContext.selected.servers.join(",")
                  );
                  setIsCopyAdds(true);
                }}
              >
                <span className="ml-1 inline-flex items-baseline text-sm">
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    {serversStateContext.selected.servers[0].slice(0, 10) +
                      "..."}
                  </span>
                </span>
                <FiCopy />
              </Button>
            )}
          </div>
        </div>
        <div className={"flex flex-col gap-2 text-center  justify-center"}>
          {window.os.os == "win32" ? (
            <>
              <h3 className={"font-semi-bold  text-gray-500"}>Network</h3>

              <div
                className={
                  "w-100 flex flex-row gap-1   justify-center text-center"
                }
              >
                {
                  <Chip
                    variant="ghost"
                    color={isConnect ? "green" : "red"}
                    size="sm"
                    value={network}
                    className={`font-[0px]  ${
                      isConnect ? "text-[#42A752]" : "text-[#B43D3D]"
                    }`}
                    icon={
                      <span
                        className={`content-[''] block w-2 h-2 rounded-full mx-auto mt-1 ${
                          isConnect ? "bg-green-900" : "bg-red-900"
                        }`}
                      />
                    }
                  />
                }
              </div>
            </>
          ) : (
            <>
              <h3 className={"font-semibold  text-gray-500"}>Status</h3>

              <div
                className={
                  "w-100 flex flex-row gap-1   justify-center text-center"
                }
              >
                {
                  <Chip
                    variant="ghost"
                    color={isConnect ? "green" : "red"}
                    size="sm"
                    value={isConnect ? "Connected" : "Disconnect"}
                    className={`font-[0px]  ${
                      isConnect ? "text-[#42A752]" : "text-[#B43D3D]"
                    }`}
                    icon={
                      <span
                        className={`content-[''] block w-2 h-2 rounded-full mx-auto mt-1 ${
                          isConnect ? "bg-green-900" : "bg-red-900"
                        }`}
                      />
                    }
                  />
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
