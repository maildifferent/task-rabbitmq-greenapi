import { Logger, LoggerConfiguration } from './definition.js';
import PinoLogger from './pino.logger.js';

export class LoggerWrapper implements Logger {
  private underlyingLogger: Logger | null = null;

  configureLogger(
    configuration: Partial<LoggerConfiguration>,
    overrideIfExists = true
  ): void {
    if (this.underlyingLogger === null || overrideIfExists === true) {
      this.underlyingLogger = new PinoLogger(
        configuration.level || 'info',
        configuration.prettyPrint || false,
        undefined
      );
    }
  }

  resetLogger() {
    this.underlyingLogger = null;
  }

  debug(message: string, ...args: unknown[]): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.debug(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.error(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.info(message, ...args);
  }

  warning(message: string, ...args: unknown[]): void {
    this.configureLogger({}, false);
    this.underlyingLogger?.warning(message, ...args);
  }
}

export const logger = new LoggerWrapper();