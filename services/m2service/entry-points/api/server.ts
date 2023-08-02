import amqplib from 'amqplib'
import { CONFIG } from './config.js'

export async function startRpcM2Service(): Promise<void> {
  const conn = await amqplib.connect(CONFIG.url)
  const channel = await conn.createChannel()
  const queueAssert = await channel.assertQueue(CONFIG.queue, { durable: false })
  const queue = queueAssert.queue

  channel.consume(queue, function reply(msg) {
    if (msg === null) return
    const obj: unknown = JSON.parse(msg.content.toString())
    if (!isObjWithProperties(obj, ['target', 'id'])) return
    const target = obj.target
    const id = obj.id
    if (typeof target !== 'string' || typeof id !== 'number') return
    channel.sendToQueue(msg.properties.replyTo,
      Buffer.from(JSON.stringify({ id, text: 'You received order with id: ' + id })), {
      correlationId: msg.properties.correlationId
    })
  }, { noAck: true }
  )
}

function isObjWithProperties<Obj, Prop extends string>(
  something: Obj, props: Readonly<Prop[]>
): something is unknown extends Obj ? Obj & { [key in Prop]: unknown } : Obj {
  if (typeof something !== 'object' || !something) return false
  for (const prop of props) {
    if (something[prop as unknown as keyof typeof something] === undefined) return false
  }
  return true
}
