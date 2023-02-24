import electronStore from "electron-store";
import {Server} from "../../shared/interfaces/server.interface";

export const dnsListStore = new electronStore<{
    dnsList: Server[]
}>()
