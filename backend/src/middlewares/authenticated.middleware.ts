import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from 'src/config/config.service';
@Injectable()
export class AuthenticatedMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;

    if (!(authorizationHeader && authorizationHeader.startsWith('Bearer '))) {
      throw new UnauthorizedException({ errors: ['unauthenticated'] });
    }

    const token = authorizationHeader.substring(7); // Remove 'Bearer ' prefix
    try {
      const decodedToken = jwt.verify(token, this.configService.env.APP_SECRET); // Replace with your actual secret key
      // Attach the decoded token to the request for future use
      req['user'] = decodedToken;
    } catch (error) {
      throw new UnauthorizedException({ errors: ['unauthenticated'] });
    }
    next();
  }
}
