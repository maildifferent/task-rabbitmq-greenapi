import { logger } from '@greenapitask/logger'
import { startRpcM2Service } from './entry-points/api/server.js'

async function start() {
  return Promise.all([startRpcM2Service()])
}

start()
  .then((startResponses) => {
    logger.info(`The app has started successfully ${startResponses}}`)
  })
  .catch((error) => {
    logger.error(error.message, error)
  })