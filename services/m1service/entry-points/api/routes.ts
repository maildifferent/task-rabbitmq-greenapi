import { logger } from '@greenapitask/logger'
import express from 'express'
import { orderRepository } from '../../data-access/repositories/order_repository.js'

export function defineRoutes(expressApp: express.Application) {
  const router = express.Router()

  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`Order API was called to get order by id ${req.params.id}`)
      const id = parseInt(req.params.id, 10)
      if (!Number.isInteger(id) || id < 1 || id > Number.MAX_SAFE_INTEGER) {
        logger.info('Id should be positive safe integer: ' + id)
        res.status(404).end()
        return
      }
      const response = await orderRepository.findById(id)

      if (!response) {
        res.status(404).end()
        return
      }

      res.json(response)
    } catch (error) {
      next(error)
    }
  })

  expressApp.use('/order', router)
}
