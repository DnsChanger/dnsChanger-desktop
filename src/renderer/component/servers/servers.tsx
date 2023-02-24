import React, {useContext} from "react";
import "react-daisyui"
import {ServerComponent} from "./server.component";
import {Server} from "../../../shared/interfaces/server.interface";
import {setState} from "../../interfaces/react.interface";

interface Props {
    serversState: Server[]
    currentActive: string
    setCurrentActive: setState<string>
}

export function ServersComponent(props: Props) {
    const serversState = props.serversState
    return (
        <div>
            {serversState.map((server) =>
                <ServerComponent server={server} currentActive={props.currentActive}
                                 setCurrentActive={props.setCurrentActive}
                                 key={server.key}/>)}
        </div>


    )

}
