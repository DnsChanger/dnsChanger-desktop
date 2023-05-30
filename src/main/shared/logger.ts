import electronLog from "electron-log"

function createLogger(logId:string): electronLog.Logger{
    return electronLog.create({ logId  })
}

export const userLogger: electronLog.Logger = createLogger("user")
