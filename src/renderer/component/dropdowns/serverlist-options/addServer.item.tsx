import React from "react";
import { Dropdown } from "react-daisyui";
import { MdOutlineAddModerator } from "react-icons/md";
import { useI18nContext } from "../../../../i18n/i18n-react";

interface Prop {
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
}

export function AddCustomServerItem(prop: Prop) {
  const { LL } = useI18nContext();

  return (
    <Dropdown.Item onClick={prop.onClick}>
      <MdOutlineAddModerator />
      {LL.buttons.favDnsServer()}
    </Dropdown.Item>
  );
}
