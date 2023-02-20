import React, {useState} from "react";

declare global {
    interface Window {
        ipc: any
    }
}

export function App() {
    const [response, setResponse] = useState("N/A")
    return (
        <div>
            Hello from Electron 👋
            Status : {response}
            <button onClick={() => testPing(setResponse)}>test ping</button>
        </div>
    )
}


async function testPing(setResponse: any) {
    const response = await window.ipc.ping()
    setResponse(response)
}
