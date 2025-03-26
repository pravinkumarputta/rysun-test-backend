import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import * as auth from 'http-auth';
import * as path from 'path';

@Injectable()
export class DigestAuthMiddleware implements NestMiddleware {
  private digest = auth.digest({
    realm: 'NestJS',
    file: path.join(__dirname, '../../../src/auth.htdigest'), // Updated path to auth.htdigest
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.digest.check((req, res) => {
      res.end(`Welcome to private area - ${req.user}!`);
      next();
    });
  }
}
