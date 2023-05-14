import React, { useContext } from "react";
import { Dropdown } from "react-daisyui";
import { MdOutlineTimer } from "react-icons/md";
import { useI18nContext } from "../../../../i18n/i18n-react";

import { activityContext } from "../../../context/activty.context";
import { ActivityContext } from "../../../interfaces/activty.interface";

export function FetchPingItem() {
  const { LL } = useI18nContext();
  const activityContextData = useContext<ActivityContext>(activityContext);

  function clickHandler() {
    if (activityContextData.reqPing == null)
      activityContextData.setReqPing(true);
    else activityContextData.setReqPing(!activityContextData.reqPing);
  }

  return (
    <Dropdown.Item onClick={clickHandler}>
      <MdOutlineTimer />
      {LL.buttons.ping()}
    </Dropdown.Item>
  );
}
