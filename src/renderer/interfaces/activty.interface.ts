import { setState } from './react.interface';
export interface ActivityContext {
    isWaiting: boolean
    setIsWaiting: any //setState<boolean>
    status: string
    setStatus: any
}