import { Dropdown } from 'react-daisyui';
import { UpdateListItemComponent } from './updatelist.item';
import { IoEllipsisVertical } from "react-icons/io5"

export function ServerListOptionsDropDownComponent() {
    return (
        <Dropdown>
            <Dropdown.Toggle size="xs">
                <IoEllipsisVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu className={"absolute w-80"}>
                <UpdateListItemComponent />
            </Dropdown.Menu>
        </Dropdown>
    )
}
