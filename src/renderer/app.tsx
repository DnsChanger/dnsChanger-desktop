import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "react-daisyui"
import { findServer, servers } from '../shared/constants/servers.cosntant';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { activityContext } from './context/activty.context';
import { AddDnsModalComponent } from "./component/modals/add-dns.component";
import { Server } from "../shared/interfaces/server.interface";
import { ServersComponent } from "./component/servers/servers";
import { NavbarComponent } from "./component/head/navbar.component";
import axios from "axios"
import { ServerListOptionsDropDownComponent } from './component/dropdowns/serverlist-options/serverlist-options.component';
import { serversContext } from './context/servers.context';

declare global {
    interface Window {
        ipc: any
        ui: any
    }
}


export function App() {
    const [currentActive, setCurrentActive] = useState<string>("")
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("")
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [serversState, setServers] = useState<Server[]>(servers)
    const values = {
        isWaiting,
        setIsWaiting,
        status,
        setStatus
    }

    useEffect(() => {
        async function fetchCustomServers() {
            const response = await window.ipc.fetchCustomServers();
            const newServers = servers.concat(response.servers);
            setServers(newServers);
        }

        fetchCustomServers();
    }, []);
    useEffect(() => {
        async function getCurrentActive() {
            const response = await window.ipc.getCurrentActive();
            if (response.success) {
                setCurrentActive(response.server.key)
            }
        }

        getCurrentActive()
    }, [])

    useEffect(() => {
        console.log("useEffect by serversState")
    }, [serversState])


    return (

        <div>
            <NavbarComponent />
            <div className="lg:flex-row dark:bg-zinc-500/95">
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

                                        <div className="gap-2 items-center h-2">
                                            {currentActive &&
                                                <p className="text-green-500">
                                                    <FontAwesomeIcon icon={"check-circle"} />
                                                    {currentActive == "unknown" ?
                                                        <span>به یک سرور ناشناخته متصل هستید.</span> :
                                                        <span>  شما به <u>{findServer(currentActive)?.names.fa}</u> متصل شدید</span>
                                                    }
                                                </p>
                                            }
                                        </div>
                                    </div>

                                    <serversContext.Provider value={{ servers, setServers }}>

                                        <div className={"border border-gray-700 rounded-2xl  shadow-2xl"}>
                                            <div className=" mt-2 flex flex-grow gap-2 ml-2 mb-0 top-1">

                                                <ServerListOptionsDropDownComponent />
                                            </div>
                                            <div className={"card items-center card-body borderb "}>

                                                <div className={"overflow-y-auto "}>

                                                    <div className={"grid h-[200px] w-[300px] "}>
                                                        <ServersComponent serversState={serversState}
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



                                    <div className="mt-3">
                                        <div className="flex flex-nowrap  gap-2 ml-3">
                                            <div>
                                                <Button color="success" className="text-white"
                                                    onClick={() => setIsOpenModal(true)}>
                                                    <FontAwesomeIcon icon={["fas", "plus"]}
                                                        className="mr-2"></FontAwesomeIcon>
                                                    افزودن DNS دلخواه
                                                </Button>
                                            </div>


                                            <AddDnsModalComponent isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                                                cb={(va) => {
                                                    serversState.push(va);
                                                    setServers(serversState)
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </activityContext.Provider>

                </main>
            </div>
        </div>
    )
}

