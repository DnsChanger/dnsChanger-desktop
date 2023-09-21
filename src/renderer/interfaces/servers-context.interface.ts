import { Server } from "../../shared/interfaces/server.interface";

export interface ServersContext {
  servers: Server[];
  setServers: any;
  currentActive: Server | null;
  setCurrentActive: any;

  selected: Server | null;
  setSelected: any;

  network: string;
  setNetwork: any;
}
