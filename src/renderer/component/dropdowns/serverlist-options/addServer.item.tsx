import React from 'react';
import { Dropdown } from 'react-daisyui';
import { MdOutlineAddModerator } from 'react-icons/md';

interface Prop {
    onClick: React.MouseEventHandler<HTMLAnchorElement>
}

export function AddCustomServerItem(prop: Prop) {
    return (
        <Dropdown.Item onClick={prop.onClick}>
            <MdOutlineAddModerator />
            افزودن DNS دلخواه
        </Dropdown.Item>
    )
}