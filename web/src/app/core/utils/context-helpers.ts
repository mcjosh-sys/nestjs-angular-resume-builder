import { HttpContext, HttpContextToken } from '@angular/common/http';
import {
  HTTP_TRANSFORM_TOKEN,
  HttpTransformer,
  HttpTransformFn,
  HttpTransformValue,
} from '../tokens/http-transform.token';

export function createHttpContext<T = any>(token: HttpContextToken<T>, value: T) {
  return new HttpContext().set(token, value);
}

export function withTransform<T>(value: HttpTransformValue<T>) {
  const setPhase = (v: HttpTransformer | HttpTransformFn) => {
    if (typeof v !== 'function' && !v.phase) {
      v.phase = 'response';
    }
  };

  if (Array.isArray(value)) {
    value.forEach(setPhase);
  } else {
    setPhase(value);
  }

  return createHttpContext(HTTP_TRANSFORM_TOKEN, value);
}

export function combineContexts(...contexts: HttpContext[]) {
  const combined = new HttpContext();
  for (const context of contexts) {
    for (const key of context.keys()) {
      combined.set(key, context.get(key));
    }
  }
  return combined;
}
