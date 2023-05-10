import React from 'react';

import { ServersContext } from '../interfaces/servers-context.interface';

export const serversContext = React.createContext<ServersContext>({
    servers: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setServers: () => { },

    currentActive: null,
    setCurrentActive: () => { }
})