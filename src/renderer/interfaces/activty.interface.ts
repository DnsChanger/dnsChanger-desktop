export interface ActivityContext {
  isWaiting: boolean;
  setIsWaiting: any; //setState<boolean>
  status: string;
  setStatus: any;
  reqPing: boolean | null;
  setReqPing: any;
}
