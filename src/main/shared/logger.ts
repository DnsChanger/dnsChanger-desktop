import electronLog from 'electron-log'

export enum LogId {
  USER = 'user'
}

function createLogger(logId: string): electronLog.Logger {
  return electronLog.create({ logId })
}
export function getLoggerPathFile(logId: string): string {
  return electronLog.transports.file.getFile().path
}

export const userLogger: electronLog.Logger = createLogger(LogId.USER)
