import amqplib from 'amqplib'
import { RPC_M2SERVICE_CONFIG } from '../configs/rpc_m2service_connection_config.js'
import { DataSource } from '../data_source.js'

interface RpcM2serviceI {
  channel: amqplib.Channel,
  queueAssert: amqplib.Replies.AssertQueue,
  queue: amqplib.Replies.AssertQueue['queue']
  callbackQueueAssert: amqplib.Replies.AssertQueue,
  callbackQueue: amqplib.Replies.AssertQueue['queue']
}

interface RequestI {
  timer: NodeJS.Timeout,
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
}

let rpcM2service: RpcM2serviceI = await startRpcM2serviceConnection()

class RpcM2service extends DataSource {
  private static currCorrelationId: number = 1
  private static readonly timeout: number = 30000
  public static readonly requests: Map<number, RequestI> = new Map()

  private static getNextCorrelationId(): number {
    if (this.currCorrelationId >= Number.MAX_SAFE_INTEGER) this.currCorrelationId = 1
    return this.currCorrelationId++
  }

  public async findById(target: string, id: number): Promise<unknown> {
    const correlationId = RpcM2service.getNextCorrelationId()
    let resolve: ((value: unknown) => void) | null = null
    let reject: ((reason?: any) => void) | null = null
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    const timer = setTimeout(() => {
      const request = RpcM2service.requests.get(correlationId)
      if (!request) return
      request.reject('Timeout.')
      RpcM2service.requests.delete(correlationId)
    }, RpcM2service.timeout)

    if (!resolve || !reject) return
    RpcM2service.requests.set(correlationId, { timer, resolve, reject })

    rpcM2service.channel.sendToQueue(rpcM2service.queue,
      Buffer.from(JSON.stringify({ target, id })), {
      correlationId: correlationId.toString(),
      replyTo: rpcM2service.callbackQueue
    })

    return promise
  }
}

export const rpcM2serviceSource = new RpcM2service()

async function startRpcM2serviceConnection() {
  const conn = await amqplib.connect(RPC_M2SERVICE_CONFIG.url)
  const channel = await conn.createChannel()
  const queueAssert = await channel.assertQueue(RPC_M2SERVICE_CONFIG.queue, { durable: false })
  const queue = queueAssert.queue
  const callbackQueueAssert = await channel.assertQueue('', { exclusive: true })
  const callbackQueue = callbackQueueAssert.queue

  channel.consume(callbackQueue, function (msg) {
    if (msg === null) return
    const correlationIdStr: unknown = msg.properties.correlationId
    if (typeof correlationIdStr !== 'string') return
    const correlationId = Number(correlationIdStr)
    const request = RpcM2service.requests.get(correlationId)
    if (request === undefined) return
    request.resolve(JSON.parse(msg.content.toString()))
    RpcM2service.requests.delete(correlationId)
  }, { noAck: true }
  )

  const result = { channel, queueAssert, queue, callbackQueueAssert, callbackQueue }
  return result
}
