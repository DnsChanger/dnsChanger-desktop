import { Dropdown } from "react-daisyui";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

import { DeleteItemComponent } from "./delete.item";
import { Server } from "../../../../shared/interfaces/server.interface";
import { useI18nContext } from "../../../../i18n/i18n-react";

interface Props {
  server: Server;
}

export function ServerOptionsComponent(props: Props) {
  const { LL, locale } = useI18nContext();
  return (
    <Dropdown horizontal={locale == "fa" ? "left" : "right"}>
      <Dropdown.Toggle size="xs" color="ghost">
        <IoEllipsisHorizontalSharp />
      </Dropdown.Toggle>
      <Dropdown.Menu className={"absolute"}>
        <DeleteItemComponent server={props.server} />
      </Dropdown.Menu>
    </Dropdown>
  );
}
