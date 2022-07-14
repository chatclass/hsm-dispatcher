import { logger } from './logger'
import Server from './server'

function Start() {
    try {
      logger.info('Starting application')
      Server.start()
    } catch (error) {
      logger.error(`Error at application start`, error)
      process.exit()
    }
}

Start()
