import { Server } from "../interfaces/server.interface";

export const serversConstant: Array<Server> = [
  {
    key: "SHECAN",
    name: "Shecan",
    servers: ["178.22.122.100", "185.51.200.2"],
    avatar: "shecan.png",
    rate: 10,
  },
  {
    key: "ELECTRO",
    name: "Electro Team",
    servers: ["78.157.42.100", "78.157.42.101"],
    avatar: "electro.png",
    rate: 9,
  },
  {
    key: "RADAR_GAME",
    name: "Radar game",
    servers: ["10.202.10.10", "10.202.10.11"],
    avatar: "radar.png",
    rate: 5,
  },
  {
    key: "403.ONLINE",
    name: "403.online",
    servers: ["10.202.10.202", "10.202.10.102"],
    avatar: "403.png",
    rate: 2,
  },
  {
    key: "ASIA_TECH",
    name: "Asiatech",
    servers: ["194.36.174.161", "178.22.122.100"],
    avatar: "asiatech.png",
    rate: 1,
  },
  {
    key: "ClOUD_FLARE",
    name: "Cloudflare",
    servers: ["1.1.1.1", "1.0.0.1"],
    avatar: "cloudflare.png",
    rate: 0,
  },
];
