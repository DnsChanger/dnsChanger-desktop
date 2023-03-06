import {Dropdown} from "react-daisyui";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Server} from "../../../../shared/interfaces/server.interface";
import {DeleteItemComponent} from "./delete.item";


interface Props {
    server: Server
}

export function ServerOptionsComponent(props: Props) {
    return (
        <Dropdown horizontal={"right"}>
            <Dropdown.Toggle size="xs">
                <FontAwesomeIcon icon={"ellipsis-v"}/>
            </Dropdown.Toggle>
            <Dropdown.Menu className={"absolute w-40"}>
                <DeleteItemComponent server={props.server}/>
            </Dropdown.Menu>
        </Dropdown>
    )
}
