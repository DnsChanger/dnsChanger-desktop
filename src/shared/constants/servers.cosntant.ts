import {Server} from "../interfaces/server.interface";

export const serversConstant: Array<Server> = [
    {
        key: "SHECAN",
        names: {
            eng: "Shecan",
            fa: "شکن"
        },
        servers: ["178.22.122.100", "185.51.200.2"],
        avatar: "shecan.png"
    },
    {
        key: "ELECTRO",
        names: {
            eng: "Electro team",
            fa: "الکترو تیم"
        },
        servers: ["78.157.42.100", "78.157.42.101"],
        avatar: "electro.png"
    },
    {
        key: "RADAR_GAME",
        names: {
            eng: "Radar game",
            fa: "رادارگیم",
        },
        servers: ["10.202.10.10", "10.202.10.11"],
        avatar: "radar.png"
    },
    {
        key: "403.ONLINE",
        names: {
            eng: "403",
            fa: "403",
        },
        servers: ["10.202.10.202", "10.202.10.102"],
        avatar: "403.png"
    }
]

