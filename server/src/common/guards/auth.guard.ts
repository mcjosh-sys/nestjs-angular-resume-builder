import { getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const { sessionClaims, isAuthenticated } = getAuth(request);

    if (!isAuthenticated) {
      throw new UnauthorizedException('You must be signed in');
    }
    // console.log({ sessionClaims, auth: getAuth(request) });
    const session: Record<string, any> = sessionClaims as any;

    request.user = {
      id: session?.['sub'],
      username: session?.['username'],
      email: session?.['email_address'],
      firstName: session?.['first_name'],
      lastName: session?.['last_name'],
      platform: session?.['platform'],
    };

    return true;
  }
}
