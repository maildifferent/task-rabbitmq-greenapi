import { DataModel } from '../data_model.js'
import { rpcM2serviceSource } from '../sources/rpc_m2service_source.js'

interface OrderModelFieldsI {
  id: number
  text: string
}

class OrderModel extends DataModel<OrderModelFieldsI> {
  override typeguard(obj: unknown): obj is OrderModelFieldsI {
    if (!isObjWithProperties(obj, ['id', 'text'] as const)) return false
    const id: unknown = obj['id']
    const text: unknown = obj['text']
    if (typeof id !== 'number' || typeof text !== 'string') return false
    return true
  }
}

export const orderModel = new OrderModel('order', rpcM2serviceSource)

function isObjWithProperties<Obj, Prop extends string>(
  something: Obj, props: Readonly<Prop[]>
): something is unknown extends Obj ? Obj & { [key in Prop]: unknown } : Obj {
  if (typeof something !== 'object' || !something) return false
  for (const prop of props) {
    if (something[prop as unknown as keyof typeof something] === undefined) return false
  }
  return true
}
