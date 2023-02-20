import React, {useState} from "react";

declare global {
    interface Window {
        ipc: any
    }
}

export function App() {
    return (
        <div>
            <div className=" lg:flex-row dark:bg-zinc-900/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">
             

                </main>
            </div>
        </div>
    )
}


async function testPing(setResponse: any) {
    const response = await window.ipc.ping()
    setResponse(response)
}
