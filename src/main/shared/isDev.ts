import electron from 'electron'

const { env } = process
const isEnvSet = 'ELECTRON_IS_DEV' in env
const getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV, 10) === 1

const isDev = isEnvSet ? getFromEnv : !electron.app.isPackaged

export default isDev
