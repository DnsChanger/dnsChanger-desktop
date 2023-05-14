import React from "react";

import { ActivityContext } from "../interfaces/activty.interface";

export const activityContext = React.createContext<ActivityContext>({
  isWaiting: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsWaiting: () => {},
  status: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStatus: () => {},
  reqPing: null,
  setReqPing: () => {},
});
