import { Dropdown } from 'react-daisyui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UpdateListItemComponent } from './updatelist.item';

export function ServerListOptionsDropDownComponent() {
    return (
        <Dropdown>
            <Dropdown.Toggle size="xs">
                <FontAwesomeIcon icon={"ellipsis-v"} />
            </Dropdown.Toggle>
            <Dropdown.Menu className={"absolute w-80"}>
                <UpdateListItemComponent />
            </Dropdown.Menu>
        </Dropdown>
    )
}
