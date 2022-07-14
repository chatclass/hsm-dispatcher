import winston from 'winston'
import { Config } from './config'

const { printf } = winston.format

const formatDate = (date) => {
    const year = date.getFullYear()
    const month = `0${String(date.getMonth() + 1)}`.slice(-2)
    const day = `0${String(date.getDate())}`.slice(-2)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const seconds = date.getSeconds()

    return `${year}-${month}-${day} ${hour}:${
        minute < 10 ? `0${minute}` : minute
    }:${seconds < 10 ? `0${seconds}` : seconds}`
}

const logFormat = (env, appName) =>
    printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `[${level}] ${formatDate(
            new Date(timestamp)
        )} ${appName}-${env} ${message} `
        if (metadata) {
            const meta = JSON.stringify(metadata)
            if (meta !== '{}') msg += `\n ${meta}`
        }
        return msg
    })

const winstonLogger = (({ env, appName }) => {
    const winstonLoggerCreated = winston.createLogger({
        level: 'debug', // todo: add do env
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.timestamp(),
            logFormat(env, appName)
        ),
        transports: [new winston.transports.Console()],
    })

    return winstonLoggerCreated
})(Config)

const logger = ((standardLogger, { env }) => {
    const error = (message, ...args) => {
        const mappedArgs = args.map((arg) => {
            if (arg?.isAxiosError)
                return {
                    status: arg?.response?.status,
                    statusText: arg?.response?.statusText,
                    method: arg?.request?.method,
                    path: arg?.request?.path,
                    host: arg?.request?.host,
                    message: arg?.response?.data,
                }
            return arg
        })
        standardLogger.error(message, { ...mappedArgs })
    }

    const warn = (message: string, context?: any) => {
      standardLogger.warn(message, context)
    }

    const info = (message: string, context?: any) => {
      standardLogger.info(message, context)
    }

    const debug = (message: string, context?: any) => {
      standardLogger.debug(message, context)
    }

    return {
      debug,
      error,
      warn,
      info,
    }
})(winstonLogger, Config)

export { logger }
