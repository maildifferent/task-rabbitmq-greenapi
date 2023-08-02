import { logger } from '@greenapitask/logger'
import { startWebServer } from './entry-points/api/server.js'

async function start() {
  return Promise.all([startWebServer()])
}

start()
  .then((startResponses) => {
    logger.info(`The app has started successfully ${startResponses}}`)
  })
  .catch((error) => {

  })
