import React, {useState} from "react";
import {Button} from "react-daisyui"
import {findServer, Server, servers} from "../constants/servers.cosntant";
import IpcMainEvent = Electron.IpcMainEvent;


declare global {
    interface Window {
        ipc: any
    }
}
type  setState<T> = React.Dispatch<React.SetStateAction<T>>

export function App() {
    const [currentActive, setCurrentActive] = useState<string>("")
    const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)
    window.addEventListener('online', () => setIsOnline(true))
    window.addEventListener('offline', () => setIsOnline(false))
    return (
        <div>
            <div className=" lg:flex-row dark:bg-zinc-900/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">


                    <div className="hero min-h-screen ">
                        <div
                            className="px-0 sm:p-4 hero-content text-center max-w-[350px] md:max-w-[450px] md:min-w-[720px]  mb-1 ">
                            <div className="max-w-full sm:pt-[100px] sm:pb-[100px] sm:pr-[30px] sm:pl-[30px] p-1">
                                <div className={"flex justify-center mb-5"}>
                                    <h1 className="text-3xl font-bold ">
                                        بهترین های رفع تحریم
                                    </h1>
                                </div>

                                <div className="grid grid-cols-3 gap-4 items-center">
                                    {servers.map((server, index) => {
                                        return (
                                            <div key={index}>
                                                <Button onClick={() => clickHandler(server, setCurrentActive, isOnline)}
                                                        color={currentActive == server.key ? "success" : "info"}
                                                >{server.names.fa}</Button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={"py-4"}>
                                    <p>
                                        Status: {isOnline ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}


async function clickHandler(server: Server, setCurrentActive: setState<string>, isOnlienState: boolean) {
    try {
        if (isOnlienState)
            await window.ipc.setDns(server)
        else
            alert("اتصال خودتون رو به اینترنت بررسی کنید.")
    } catch (e: any) {
        alert(e.message)
    }
}

window.ipc.onSetDns((_event: IpcMainEvent, value: any) => {
    alert(value.message)
})

