import { pino, Logger as PinoLoggerImpl, DestinationStream, LoggerOptions } from 'pino'
import { LOG_LEVELS, Logger } from './definition.js'

export default class PinoLogger implements Logger {
  private readonly logger: PinoLoggerImpl

  constructor(
    private level: LOG_LEVELS,
    private prettyPrintEnabled: boolean,
    private destStream?: DestinationStream | string
  ) {
    const opts: LoggerOptions = {
      level,
    }
    if (prettyPrintEnabled) opts.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        sync: true,
      },
    }
    this.logger = pino(opts)
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args)
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args)
  }

  warning(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args)
  }

  temp(): void {
    this.level
    this.prettyPrintEnabled
    this.destStream
  }
}