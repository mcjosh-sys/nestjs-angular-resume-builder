import { clerkMiddleware } from '@clerk/express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ClerkMiddleware implements NestMiddleware {
  private clerkMiddleware = clerkMiddleware({});

  use(req: Request, res: Response, next: NextFunction) {
    this.clerkMiddleware(req, res, (err?: any) => {
      if (err) {
        console.error(err);
        throw new UnauthorizedException('Invalid authentication');
      }
      next();
    });
  }
}
