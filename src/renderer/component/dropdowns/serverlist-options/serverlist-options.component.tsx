import { Dropdown } from 'react-daisyui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateListItemComponent } from './updatelist.item';
export function ServerListOptionsDropDownComponent() {
    return (
        <Dropdown>
            <Dropdown.Toggle size="xs" color="ghost">
                <FontAwesomeIcon icon={"ellipsis-v"} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="w-52">
                <UpdateListItemComponent />
            </Dropdown.Menu>
        </Dropdown>
    )
}