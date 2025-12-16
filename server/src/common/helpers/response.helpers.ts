import { HttpException } from '@nestjs/common';
import type { SuccessResponse } from '../types/response.types';

type SuccessOpts<T> = {
  type: 'success';
  data: T;
  message?: string;
  statusCode?: number;
};

type ErrorOpts<E> = {
  type: 'error';
  data: E;
  message?: string;
  statusCode?: number;
};

export const RESPONSE_BRAND = Symbol('__response__');

export function generateResponse<T>(opts: SuccessOpts<T>): SuccessResponse<T>;

export function generateResponse<E>(opts: ErrorOpts<E>): never;

export function generateResponse(opts: any): any {
  const { type, data, message, statusCode } = opts;

  if (type === 'success') {
    const response: SuccessResponse<any> = {
      success: true,
      statusCode: statusCode ?? 200,
      message,
      data,
    };

    (response as any)[RESPONSE_BRAND] = true;

    return response;
  } else {
    const errorResponse = {
      success: false,
      statusCode: statusCode ?? 200,
      message,
      error: data,
      data: null,
    } as any;

    errorResponse[RESPONSE_BRAND] = true;

    throw new HttpException(errorResponse, statusCode ?? 400);
  }
}
