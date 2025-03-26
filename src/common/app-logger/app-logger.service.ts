import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}] - ${message}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winston.transports.Console(),
      ],
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
  fatal?(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    const winstonLevels = levels.reduce(
      (acc, level) => {
        acc[level] = levels.indexOf(level);
        return acc;
      },
      {} as Record<string, number>,
    );
    this.logger.levels = winstonLevels;
  }
}
