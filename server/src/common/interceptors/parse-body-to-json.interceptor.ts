import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ParseBodyToJsonInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    for (const key in body) {
      try {
        body[key] = body[key] === 'null' ? null : JSON.parse(body[key]);
      } catch (e) {
        // If parsing fails, it's not a JSON string, so keep it as is.
      }
    }
    return next.handle();
  }
}
