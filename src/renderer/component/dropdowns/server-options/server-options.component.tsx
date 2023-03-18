import { Dropdown } from "react-daisyui";
import { Server } from "../../../../shared/interfaces/server.interface";
import { DeleteItemComponent } from "./delete.item";
import { IoEllipsisHorizontalSharp } from "react-icons/io5"

interface Props {
    server: Server
}

export function ServerOptionsComponent(props: Props) {
    return (
        <Dropdown horizontal={"right"} >
            <Dropdown.Toggle size="xs" color="ghost">
                <IoEllipsisHorizontalSharp />
            </Dropdown.Toggle>
            <Dropdown.Menu className={"absolute"}>
                <DeleteItemComponent server={props.server} />
            </Dropdown.Menu>
        </Dropdown>
    )
}
