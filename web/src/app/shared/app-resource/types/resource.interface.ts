import { Observable } from 'rxjs';

/**
 * Resource<T, E> is a signal-like reactive wrapper around an RxJS Observable.
 *
 * It provides:
 * - The latest emitted value (call the resource like a function).
 * - Loading and error states.
 * - Utility methods to refresh, reset, or destroy the resource.
 * - Event hooks for reacting to state changes (data, loading, error, completion).
 * - Value transformation via `perform` (similar to `map`).
 *
 * @typeParam T - The type of the observable's emitted values.
 * @typeParam E - The type of the observable's error (defaults to `any`).
 */
export interface Resource<T, E = any> {
  (): T | undefined;

  setSource: (observable$: Observable<T>) => void;
  clear: () => void;
  loading: () => boolean;
  error: () => E | null;
  reload: () => void;
  destroy: () => void;
  hasData: () => boolean;

  onError: (callback: (error: E) => void) => void;
  onLoading: (callback: (loading: boolean) => void) => void;
  onData: (callback: (data: T) => void) => void;
  onComplete: (callback: () => void) => void;
}
