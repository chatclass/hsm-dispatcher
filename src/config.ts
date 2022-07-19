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
  uri_token: process.env.URI_TOKEN,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  nuhub: {
      baseUrl: envString('NUHUB_BASE_URL'),
  },
  wap11: {
    database: {
      uri: envString('WAPP11_CONNECTION_STRING'),
      name: envString('WAPP11_DATABASE_NAME')
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
    },
    credentials: JSON.parse(envString('GCP_CREDENTIALS', 'Resultados'))
  },
	whatsapp: {
		beieditora: {
			key: envString('WHATSAPP_BEI_KEY')
		},
		phomenta: {
			key: envString('WHATSAPP_PHOMENTA_KEY')
		},
		ninenine: {
			key: envString('WHATSAPP_99_KEY')
		},
		cultura: {
			key: envString('WHATSAPP_CULTURA_KEY')
		},
    gsh: {
			key: envString('WHATSAPP_GSH_KEY')
		},
    vila: {
			key: envString('WHATSAPP_VILA_KEY')
		}
	}
}

export { Config }
