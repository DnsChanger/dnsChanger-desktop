import { Server, ServerStore } from "../interfaces/server.interface";

export const serversConstant: Array<ServerStore> = [
  {
    key: "SHECAN",
    name: "Shecan",
    servers: ["178.22.122.100", "185.51.200.2"],
    avatar: "shecan.png",
    rate: 10,
    tags: ["Gaming", "Web", "Ai"],
    isPin: false,
  },
  {
    key: "ELECTRO",
    name: "Electro Team",
    servers: ["78.157.42.100", "78.157.42.101"],
    avatar: "electro.png",
    rate: 9,
    tags: ["Gaming", "Web", "Ai"],
    isPin: false,
  },
  {
    key: "RADAR_GAME",
    name: "Radar game",
    servers: ["10.202.10.10", "10.202.10.11"],
    avatar: "radar.png",
    rate: 5,
    tags: ["Gaming"],
    isPin: false,
  },

  {
    key: "ClOUD_FLARE",
    name: "Cloudflare",
    servers: ["1.1.1.1", "1.0.0.1"],
    avatar: "cloudflare.png",
    rate: 0,
    tags: ["Web"],
    isPin: false,
  },
];
