import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from "react-daisyui"
import { findServer, Server, servers } from "../constants/servers.cosntant";
import IpcMainEvent = Electron.IpcMainEvent;
import { ipcMain } from "electron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ServerComponent } from "./component/servers/server.component";
import { activityContext } from './context/activty.context';
import { shell } from "electron";
declare global {
    interface Window {
        ipc: any
    }
}


export function App() {
    const [currentActive, setCurrentActive] = useState<string>("")
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("")

    const values = {
        isWaiting,
        setIsWaiting,
        status,
        setStatus
    }
    return (

        <div>

            <div className="navbar bg-base-100">
                <div className="navbar-start"></div>
                <div className="navbar-end">
                    <Button className={"btn gap-2 normal-case btn-ghost"} onClick={() => window.ipc.openBrowser("https://github.com/DnsChanger/dnsChanger-desktop")}>
                        <FontAwesomeIcon icon={["fab", "github"]} size={"lg"} />
                    </Button>
                </div>
            </div>
            <div className=" lg:flex-row dark:bg-zinc-900/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">

                    <activityContext.Provider value={values}>

                        <div className="hero">
                            <div
                                className="px-0 sm:p-4 hero-content text-center max-w-[350px] md:max-w-[450px] md:min-w-[720px]  mb-1 ">
                                <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
                                    <div className={"grid justify-center mb-10"}>
                                        <h1 className="text-3xl font-bold mb-2">
                                            بهترین های رفع تحریم
                                        </h1>
                                        {currentActive &&

                                            <span className="text-green-500">
                                                شما به <strong>{findServer(currentActive)?.names.fa}</strong> وصل شدید
                                            </span>
                                        }
                                    </div>

                                    <div className={"relative border border-gray-700 rounded-2xl  shadow-2xl"}>
                                        <div className={"card items-center card-body"}>
                                            <div className={"overflow-y-auto "} >
                                                <div className={"grid h-[200px] w-[300px] "}>
                                                    {servers.map((server, index) =>
                                                        <ServerComponent server={server} currentActive={currentActive} setCurrentActive={setCurrentActive} key={index} />)}
                                                </div>
                                            </div>
                                            <div >
                                                <p color="" className="text-red-400 absolute bottom-[10px] right-2">
                                                    {status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="mt-3">
                                        <div className="float-right">
                                            <Button color="success" className="text-white">
                                                <FontAwesomeIcon icon={["fas", "plus"]} className="mr-2"></FontAwesomeIcon>
                                                افزودن DNS دلخواه
                                            </Button>
                                        </div>
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </activityContext.Provider>

                </main>
            </div>
        </div>
    )
}



