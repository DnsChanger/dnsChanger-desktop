import React from 'react';
import { ActivityContext } from '../interfaces/activty.interface';
export const activityContext = React.createContext<ActivityContext>({
    isWaiting: false,
    setIsWaiting: () => { },
    status: "",
    setStatus: () => { }
})