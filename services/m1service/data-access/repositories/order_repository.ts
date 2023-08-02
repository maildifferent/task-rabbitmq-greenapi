import { DataRepository } from '../data_repository.js'
import { orderModel } from '../models/order_model.js'

type OrderRecordT = {
  id: number
  text: string
}

class OrderRepository extends DataRepository<OrderRecordT> {
}

export const orderRepository = new OrderRepository(orderModel)
