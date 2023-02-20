export interface Server {
    key: string
    names: {
        eng: string
        fa: string
    }
    servers: string[]
    avatar: string
}

export const servers: Array<Server> = [
    {
        key: "SHECAN",
        names: {
            eng: "shecan",
            fa: "شکن"
        },
        servers: ["178.22.122.100", "185.51.200.2"],
        avatar: "shecan.png"
    },
    {
        key: "ELECTRO",
        names: {
            eng: "electro team",
            fa: "الکترو تیم"
        },
        servers: ["78.157.42.100", "78.157.42.101"],
        avatar: "electro.png"
    },
    {
        key: "RADAR_GAME",
        names: {
            eng: "radar game",
            fa: "رادارگیم",
        },
        servers: ["10.202.10.10", "10.202.10.11"],
        avatar: "radar.png"
    }
]


export function findServer(key: string): Server | null {
    return servers.find((server) => server.key == key)
}
