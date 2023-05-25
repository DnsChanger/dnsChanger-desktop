import { Button, Select } from "react-daisyui";
import {
  MdOutlineSignalCellularAlt,
  MdOutlineAddModerator,
} from "react-icons/md";
import { CiPower } from "react-icons/ci";
// eslint-disable-next-line import/no-unresolved
import { serversConstant } from "@/shared/constants/servers.cosntant";
// eslint-disable-next-line import/no-unresolved
import { Server } from "@/shared/interfaces/server.interface";
import { TfiReload } from "react-icons/tfi";

export function HomePage() {
  return (
    <div className="container">
      <div className="px-0 sm:p-4 hero-content text-center max-w-[500px]   mb-1 ">
        <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
          <div className={"flex flex-row gap-10"}>
            <div className={"absolute right-[550px] flex-grow-0"}>
              <div className={"flex flex-col"}>
                <div>
                  <Button
                    shape={"circle"}
                    className="bg-white  outline -outline-offset-2 outline-8 outline-[#cfcfcf1a] hover:bg-[#D6D6D6]"
                    style={{ width: 130, height: 130 }}
                  >
                    <CiPower
                      size={60}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </Button>
                </div>
                <div className={"mt-5 font-[balooTamma] text-2xl "}>
                  Disconnect
                </div>
              </div>
            </div>
            <div className={"absolute right-[50px] top-[100px]"}>
              <div className={"flex flex-col"}>
                <div className={"flex-none"}>
                  <Select className={"w-[350px] bg-[#262626]"}>
                    {serversConstant.map((server: Server) => {
                      return <Select.Option>{server.names.eng}</Select.Option>;
                    })}
                  </Select>
                </div>
                <div className="bg-[#262626] h-[189px] w-[362px] mt-5 rounded-[23px]">
                  <div className={"grid grid-cols-2 gap-4 mt-5"}>
                    <div className={"flex flex-col gap-2"}>
                      <h3 className={"font-bold"}>Name</h3>

                      <div
                        className={
                          "w-100 text-center flex flex-row gap-2 justify-center"
                        }
                      >
                        <img
                          src="https://sv1.donateon.ir/uploads/avatars/1g4GvfD1JpyO6C6i4ZnWvhrXFgbTQ8063bclMFM8.png"
                          alt=""
                          className="self-center w-5 h-5 rounded-full mr-1"
                        />
                        <span className="ml-1 inline-flex items-baseline text-sm">
                          <span className="font-medium text-slate-900 dark:text-slate-200 text-center">
                            Electro Team
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "flex flex-col gap-2 text-center  justify-center"
                      }
                    >
                      <h3 className={"font-bold"}>Ping</h3>

                      <div
                        className={
                          "w-100 flex flex-row gap-1   justify-center text-center"
                        }
                      >
                        <MdOutlineSignalCellularAlt
                          className={"mt-0.5 text-[#40CF4E]"}
                        />
                        <span className="ml-1 inline-flex items-baseline text-sm">
                          <span className="font-medium text-slate-900 dark:text-slate-200">
                            80
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "flex flex-col gap-2 text-center  justify-center"
                      }
                    >
                      <h3 className={"font-bold"}>Address</h3>

                      <div
                        className={
                          "w-100 flex flex-row gap-2   justify-center text-center"
                        }
                      >
                        <span className="ml-1 inline-flex items-baseline text-sm ">
                          <span className="font-medium text-xs text-slate-900 dark:text-slate-200">
                            78.157.42.101, 78.157.42.100
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={"absolute top-[220px] ml-5 flex flex-row gap-1"}
                  >
                    <Button
                      shape={"circle"}
                      size={"sm"}
                      className={"bg-[#383838] border-none text-center"}
                    >
                      <TfiReload />
                    </Button>
                    <Button
                      shape={"circle"}
                      size={"sm"}
                      className={"bg-[#383838] border-none text-center"}
                    >
                      <MdOutlineAddModerator />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
