import React, { useEffect, useState } from "react";
import { Badge, Button, Tooltip } from "react-daisyui"
import { findServer, Server, servers } from "../constants/servers.cosntant";
import IpcMainEvent = Electron.IpcMainEvent;
import { ipcMain } from "electron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ServerComponent } from "./component/servers/server.component";

declare global {
    interface Window {
        ipc: any
    }
}
type setState<T> = React.Dispatch<React.SetStateAction<T>>


export function App() {
    const [currentActive, setCurrentActive] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (
        <div>
            <div className=" lg:flex-row dark:bg-zinc-900/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">


                    <div className="hero min-h-screen ">
                        <div
                            className="px-0 sm:p-4 hero-content text-center max-w-[350px] md:max-w-[450px] md:min-w-[720px]  mb-1 ">
                            <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
                                <div className={"grid justify-center mb-10"}>
                                    <h1 className="text-3xl font-bold mb-2">
                                        بهترین های رفع تحریم
                                    </h1>
                                    <span className="text-green-500">
                                        شما به x وصل شدید
                                    </span>
                                </div>

                                <div className={"relative border border-gray-700 rounded-2xl  shadow-2xl"}>

                                    <div className={"card items-center "}>
                                        <div className={"overflow-x-auto card-body"} >
                                            <div className={"grid h-[200px] w-[300px] "}>
                                                {servers.map((server, index) =>
                                                    <ServerComponent server={server} key={index} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="float-right">
                                        <Button className="bg-green-500 text-white">
                                            <FontAwesomeIcon icon={["fas", "plus"]} className="mr-2"></FontAwesomeIcon>
                                            افزودن DNS دلخواه
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}


async function clickHandler(server: Server, setCurrentActive: setState<string>, setIsLoading: any) {
    try {

        this.target.classList.add("loading")
        setIsLoading(true)
        const response = await window.ipc.setDns(server)
        if (response.success) {
            setCurrentActive(server.key)
        }
        alert(response.message)


    } catch (e: any) {
        alert(e.message)
    } finally {
        this.target.classList.remove("loading")
        setIsLoading(false)
    }
}



