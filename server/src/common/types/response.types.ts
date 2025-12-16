export type ResponseType = 'success' | 'error';

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  statusCode: number;
}

export interface ErrorResponse<T> {
  success: false;
  error: T;
  message: string;
  statusCode: number;
}
