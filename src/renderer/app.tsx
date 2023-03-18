import React, { useEffect, useState } from "react";
import { BottomNavigation } from "react-daisyui"


import { activityContext } from './context/activty.context';
import { Server } from "../shared/interfaces/server.interface";
import { ServersComponent } from "./component/servers/servers";
import { NavbarComponent } from "./component/head/navbar.component";
import {
    ServerListOptionsDropDownComponent
} from './component/dropdowns/serverlist-options/serverlist-options.component';
import { serversContext } from './context/servers.context';
import { HiOutlineShieldCheck } from "react-icons/hi"
import { TbCloudDataConnection } from "react-icons/tb"
import { RiSettings3Line } from "react-icons/ri"

export function App() {
    const [currentActive, setCurrentActive] = useState<Server | null>(null)
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("")
    const [serversState, setServers] = useState<Server[]>([])
    const values = {
        isWaiting,
        setIsWaiting,
        status,
        setStatus
    }

    useEffect(() => {
        async function fetchDnsList() {
            const response = await window.ipc.fetchDnsList();
            setServers(response.servers);
        }

        fetchDnsList();
    }, []);
    useEffect(() => {
        async function getCurrentActive() {
            const response = await window.ipc.getCurrentActive();
            if (response.success) {
                setCurrentActive(response.server)
            }
        }

        getCurrentActive()
    }, [])


    const size = 30

    return (

        <div>
            <NavbarComponent />
            <div className="lg:flex-row dark:bg-zinc-500/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">
                    <activityContext.Provider value={values}>

                        <div className="hero">
                            <div
                                className="px-0 sm:p-4 hero-content text-center max-w-[400px]   mb-1 ">
                                <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
                                    <div className={"grid justify-center mb-10"}>
                                        <h1 className="text-3xl font-bold mb-2">
                                            بهترین های رفع تحریم
                                        </h1>

                                        <div className="gap-2 items-center h-2">
                                            {currentActive &&
                                                <p className="text-green-500">
                                                    {""}
                                                    <HiOutlineShieldCheck style={{ display: "inline" }} />

                                                    {currentActive.key == "unknown" ?
                                                        <span>به یک سرور  ناشناخته متصل هستید.</span> :
                                                        <span>  شما به <u>{currentActive.names.fa}</u> متصل شدید</span>
                                                    }
                                                    <br />
                                                </p>
                                            }
                                        </div>
                                    </div>

                                    <serversContext.Provider value={{ servers: serversState, setServers }}>

                                        <div className={"border border-y-gray-500 border-x-0 rounded-2xl  shadow-2xl"}>
                                            <div className=" mt-2 flex flex-grow gap-2 ml-2 mb-0 top-1">
                                                <ServerListOptionsDropDownComponent />
                                            </div>
                                            <div className={"card items-center card-body"}>

                                                <div className={"overflow-y-auto"}>

                                                    <div className={"grid h-[200px] w-[350px] p-2 "}>
                                                        <ServersComponent
                                                            currentActive={currentActive}
                                                            setCurrentActive={setCurrentActive} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p color="" className="text-red-400 absolute bottom-[10px] right-2">
                                                        {status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </serversContext.Provider>

                                </div>
                            </div>
                        </div>
                    </activityContext.Provider>
                </main>
            </div>
            <BottomNavigation size="xs">
                <div className="active">
                    <TbCloudDataConnection size={size} />
                </div>

            </BottomNavigation>

        </div >
    )
}

