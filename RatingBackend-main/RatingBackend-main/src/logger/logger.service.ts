import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import kleur from 'kleur';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    const logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;

    this.logger = createLogger({
      level: logLevel,
      format: this.getLogFormat(),
      transports: this.getLogTransports(),
    });
  }

  private getLogFormat() {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, stack, context }) => {
        const colorFunction = this.getLogColor(level as LogLevel);
        const contextInfo = context ? ` [${context}]` : '';
        return `${timestamp} [${level.toUpperCase()}]: ${colorFunction(message)}${contextInfo} ${stack || ''}`.trim();
      }),
    );
  }

  private getLogTransports() {
    return [
      new transports.Console(),
      new transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ];
  }

  private getLogColor(level: LogLevel): (text: string) => string {
    const colorMap: { [key in LogLevel]: (text: string) => string } = {
      [LogLevel.ERROR]: kleur.red,
      [LogLevel.WARN]: kleur.yellow,
      [LogLevel.INFO]: kleur.green,
      [LogLevel.DEBUG]: kleur.cyan,
      [LogLevel.VERBOSE]: kleur.magenta,
    };
    return colorMap[level] || kleur.dim;
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { stack: trace, context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  logObject(obj: any, context?: string): void {
    this.logger.info(this.formatObject(obj), { context });
  }

  private formatObject(obj: any): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }
}
