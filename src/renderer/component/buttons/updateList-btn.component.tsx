import _ from "lodash";
import axios from "axios";
import { Button } from "react-daisyui";
import { useContext, useState } from "react";
import { FaRedoAlt } from "react-icons/fa";

import { setState } from "../../interfaces/react.interface";
import { activityContext } from "../../context/activty.context";
import { ActivityContext } from "../../interfaces/activty.interface";
import { Server } from "../../../shared/interfaces/server.interface";
import { useI18nContext } from "../../../i18n/i18n-react";
import { UrlsConstant } from "../../../shared/constants/urls.constant";
import { TfiReload } from "react-icons/tfi";

const cacheBuster = (url: string) => `${url}?cb=${Date.now()}`;

interface Props {
  servers: Server[];
  setServers: setState<Server[]>;
}

export function UpdateListBtnComponent(prop: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activityContextData = useContext<ActivityContext>(activityContext);
  const { LL } = useI18nContext();

  async function updateHandler() {
    if (isLoading) return alert(LL.waiting()); //todo add toast
    try {
      setIsLoading(true);

      const response = await axios.get<Server[]>(
        cacheBuster(UrlsConstant.STORE)
      );
      const servers = prop.servers.concat(response.data);
      const uniqList = _.uniqWith(servers, _.isEqual);

      prop.setServers(uniqList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      shape={"circle"}
      size={"sm"}
      className={"bg-[#B3B3B3] dark:bg-[#383838] border-none text-center"}
      onClick={() => updateHandler()}
    >
      <TfiReload className={` ${isLoading ? "spinner" : ""}`} />
    </Button>
  );
}
