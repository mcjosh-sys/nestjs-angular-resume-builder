import { HttpContextToken } from '@angular/common/http';
import { Prettify } from '@shared/models/utility.model';
import { ExtractKeys } from '../utils/object-helpers';

export type HttpTransformFn = (value: any) => any;

export type HttpTransformPhase = 'request' | 'response' | 'both';

export type HttpTransformField<T = any> =
  T extends Record<string, any>
    ? ExtractKeys<T> extends never
      ? null
      : ExtractKeys<T>
    : T extends Array<infer U>
      ? HttpTransformField<U>
      : null;

export type HttpTransformer<T = any> = {
  /** Optional field name to transform in the payload */
  fieldName?: HttpTransformField<T>;
  /** Function to transform the value */
  transformFn: HttpTransformFn;
  /** Which phase to apply the transform */
  phase?: HttpTransformPhase;
};

export type HttpTransformerWithPhase<T = any> = Prettify<
  HttpTransformer<T> & { phase: HttpTransformPhase }
>;

/**
 * A single transform can be either:
 * - a config object with a fieldName and transform function
 * - or just a plain transform function (applied to the entire payload)
 */
export type HttpTransformValue<T = any> =
  | HttpTransformer<T>
  | HttpTransformFn
  | (HttpTransformer<T> | HttpTransformFn)[];

/**
 * The context value can be:
 * - a single transform
 * - multiple transforms
 * - or null if none
 */
export const HTTP_TRANSFORM_TOKEN = new HttpContextToken<HttpTransformValue | null>(() => null);
