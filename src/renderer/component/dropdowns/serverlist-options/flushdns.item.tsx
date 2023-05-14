import React, { useContext } from "react";
import { Dropdown } from "react-daisyui";
import { GiMagicBroom } from "react-icons/gi";
import { useI18nContext } from "../../../../i18n/i18n-react";
import { ServersContext } from "../../../interfaces/servers-context.interface";
import { serversContext } from "../../../context/servers.context";

export function FlushDnsItem() {
  const { LL } = useI18nContext();
  const serversContextData = useContext<ServersContext>(serversContext);

  async function flushHandler() {
    const response = await window.ipc.flushDns();
    if (response.success) {
      serversContextData.setCurrentActive(null);
      window.ipc.notif(LL.dialogs.flush_successful());
    } else {
      window.ipc.notif(LL.dialogs.flush_failure());
    }
  }

  return (
    <Dropdown.Item onClick={flushHandler}>
      <GiMagicBroom />
      {LL.buttons.flushDns()}
    </Dropdown.Item>
  );
}
