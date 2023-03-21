import electronStore from 'electron-store';

import { Server } from '../../shared/interfaces/server.interface';
import { serversConstant } from '../../shared/constants/servers.cosntant';

export const store = new electronStore<{
    dnsList: Server[],
}>({
        defaults: {
            dnsList: serversConstant
        },
        name: 'dnsChangerStore'
    }
)
