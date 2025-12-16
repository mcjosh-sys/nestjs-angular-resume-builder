import {
  HttpTransformer,
  HttpTransformerWithPhase,
  HttpTransformFn,
  HttpTransformPhase,
  HttpTransformValue,
} from '../../tokens/http-transform.token';
import { getDeepValue, setDeepValue } from '../../utils/object-helpers';

export function normalizeHttpTransformers(transform: HttpTransformValue) {
  const normalize = (t: HttpTransformer | HttpTransformFn): HttpTransformerWithPhase => {
    if (typeof t === 'function') {
      return {
        transformFn: t,
        phase: 'response',
      };
    }
    return {
      ...t,
      phase: t.phase ?? 'response',
    };
  };

  return Array.isArray(transform) ? transform.map(normalize) : [normalize(transform)];
}

export function applyHttpTransformers<T = any>(
  data: T,
  transform: HttpTransformValue,
  phase: Exclude<HttpTransformPhase, 'both'> = 'response',
): T {
  const transformers = normalizeHttpTransformers(transform);

  for (const t of transformers) {
    const shouldApply =
      (phase === 'response' && t.phase !== 'request') ||
      (phase === 'request' && ['request', 'both'].includes(t.phase));

    if (shouldApply) {
      if (t.fieldName) {
        if (t.fieldName) {
          const current = getDeepValue(data, t.fieldName as string);
          if (current !== undefined) {
            setDeepValue(data, t.fieldName as string, t.transformFn(current));
          }
        }
      } else {
        data = t.transformFn(data);
      }
    }
  }

  return data;
}
