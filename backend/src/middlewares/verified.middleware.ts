import { Injectable, NestMiddleware } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class VerifiedMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    log('Verified');
    next();
  }
}
