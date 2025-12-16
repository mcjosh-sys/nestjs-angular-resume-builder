import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response.decorator';
import { generateResponse, RESPONSE_BRAND } from '../helpers/response.helpers';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const method = request.method.toUpperCase();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && RESPONSE_BRAND in data) {
          delete data[RESPONSE_BRAND];
          return data;
        }

        const customMessage = this.reflector.get<string>(
          RESPONSE_MESSAGE_KEY,
          context.getHandler(),
        );
        const message = customMessage || this.getMessageForMethod(method);

        const { [RESPONSE_BRAND]: _, ...wrapped } = generateResponse({
          type: 'success',
          data,
          message,
          statusCode: httpContext.getResponse().statusCode,
        }) as any;

        return wrapped;
      }),
    );
  }

  private getMessageForMethod(method: string): string {
    switch (method) {
      case 'GET':
        return 'Fetched successfully';
      case 'POST':
        return 'Created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Updated successfully';
      case 'DELETE':
        return 'Deleted successfully';
      default:
        return 'Request successful';
    }
  }
}
