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
    if (activityContextData.isWaiting) return; //todo add toast
    try {
      setIsLoading(true);

      activityContextData.setStatus(LL.dialogs.fetching_data_from_repo());

      activityContextData.setIsWaiting(true);

      const response = await axios.get<Server[]>(
        cacheBuster(UrlsConstant.STORE)
      );
      const servers = prop.servers.concat(response.data);
      const uniqList = _.uniqWith(servers, _.isEqual);

      prop.setServers(uniqList);
    } catch (error) {
    } finally {
      activityContextData.setIsWaiting(false);
      activityContextData.setStatus("");
      setIsLoading(false);
    }
  }

  return (
    <Button
      color="error"
      className="text-white"
      size="xs"
      onClick={() => updateHandler()}
    >
      <FaRedoAlt className={`mr-2 ${isLoading ? "spinner" : ""}`} />
      {LL.buttons.update()}
    </Button>
  );
}
