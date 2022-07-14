import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

function envString(envName: string, defaultValue?: string) {
    const env = process.env[envName]
    if(env) return String(env)
    if (!env && !defaultValue) throw new Error(`Missing environment variable: ${envName}`)
    return String(defaultValue)
}

const Config = {
  appName: 'hsm-dispatcher',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  nuhub: {
      baseUrl: envString('NUHUB_BASE_URL'),
  },
  wap11: {
    database: {
      connectionString: envString('WAPP11_CONNECTION_STRING')
    }
  },
  gsheet: {
    sheetId: envString('GSHEET_ID'),
    tables: {
      schedules: {
        name: envString('GSHET_SCHEDULES_TABLE', 'Disparos')
      },
      logs: {
        name: envString('GSHEET_LOGS_TABLE', 'Resultados')
      }
    }
  }
}

export { Config }