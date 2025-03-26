import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppLoggerService } from '../../common/app-logger/app-logger.service';
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const headers: any = JSON.parse(JSON.stringify(req.headers));
    delete headers.authorization;

    this.logger.log(
      `➡️ ${req.method} ${req.originalUrl} - IP: ${req.ip} - Headers: ${JSON.stringify(headers)} - Params: ${JSON.stringify(req.params)} - Body: ${JSON.stringify(req.body)}`,
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logMessage = `⬅️ ${req.method} ${req.originalUrl} 
        - Status: ${res.statusCode}
        - Duration: ${duration}ms
        - Headers: ${JSON.stringify(req.headers)}
        - Response: ${JSON.stringify(res.locals || {})}`;
      this.logger.log(logMessage);
    });

    next();
  }
}
