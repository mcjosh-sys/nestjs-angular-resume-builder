import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RESPONSE_BRAND } from '../helpers/response.helpers';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: exception.message, error: exception };
    if (typeof errorResponse === 'object' && RESPONSE_BRAND in errorResponse) {
      const { [RESPONSE_BRAND]: _, ...cleaned } = errorResponse;
      return response.status(status).json(cleaned);
    }
    const message =
      typeof errorResponse === 'object' && 'message' in errorResponse
        ? errorResponse.message
        : typeof errorResponse === 'string'
          ? errorResponse
          : status === 500
            ? 'Internal Server Error'
            : 'An error occurred';

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: (errorResponse as any)?.error ?? errorResponse,
      data: null,
    });
  }
}
