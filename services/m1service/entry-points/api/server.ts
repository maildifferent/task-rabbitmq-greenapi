import { Server } from 'http'
import { logger } from '@greenapitask/logger'
import { AddressInfo } from 'net'
import express from 'express'
import { defineRoutes } from './routes.js'

let connection: Server

export async function startWebServer(): Promise<AddressInfo> {
  logger.configureLogger(
    {
      prettyPrint: true,
    },
    true
  )
  const expressApp = express()
  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.json())
  defineRoutes(expressApp)
  defineErrorHandlingMiddleware(expressApp)
  const APIAddress = await openConnection(expressApp)
  return APIAddress
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = 8080
    const webServerPort = portToListenTo || 0
    logger.info(`Server is about to listen to port ${webServerPort}`)
    connection = expressApp.listen(webServerPort, () => {
      resolve(connection.address() as AddressInfo)
    })
  })
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      error: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error(error.message, error)
      res.status(error?.HTTPStatus || 500).end()
    }
  )
}
