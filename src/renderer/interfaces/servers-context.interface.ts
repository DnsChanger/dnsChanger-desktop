import { Server, ServerStore } from "../../shared/interfaces/server.interface";

export interface ServersContext {
  servers: ServerStore[];
  setServers: any;
  currentActive: ServerStore | null;
  setCurrentActive: any;

  selected: ServerStore | null;
  setSelected: any;

  network: string;
  setNetwork: any;
}
