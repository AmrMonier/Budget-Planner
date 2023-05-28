import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.isVerified)
      throw new ForbiddenException({ errors: ['Unverified account'] });
    next();
  }
}
