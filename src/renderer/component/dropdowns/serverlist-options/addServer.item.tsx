import React from 'react';
import { Dropdown } from 'react-daisyui';
import { MdOutlineAddModerator } from 'react-icons/md';
import { useTranslation } from 'react-multi-lang';

interface Prop {
    onClick: React.MouseEventHandler<HTMLAnchorElement>
}

export function AddCustomServerItem(prop: Prop) {
    const translate = useTranslation();
    return (
        <Dropdown.Item onClick={prop.onClick}>
            <MdOutlineAddModerator />
            {translate("buttons.favDnsServer")}
        </Dropdown.Item>
    )
}