import { DestroyRef, inject, signal } from '@angular/core';
import { finalize, Observable, Subscription } from 'rxjs';
import { queueMicrotask } from 'src/app/core/utils/polyfills';
import { Resource as AppResource } from './types/resource.interface';

export function appResource<T, E = any>(
  initialData?: T,
  observable$?: Observable<T>,
): AppResource<T, E> {
  let cached = signal(initialData);
  let _loading = signal(false);
  let _error = signal<E | null>(null);
  let subscription: Subscription | null = null;
  let _observable$ = observable$;

  const errorCallbacks: ((err: E) => void)[] = [];
  const loadingCallbacks: ((loading: boolean) => void)[] = [];
  const dataCallbacks: ((data: T) => void)[] = [];
  const completeCallbacks: (() => void)[] = [];
  const pipeCallbacks: ((data: T) => T)[] = [];
  const destroyRef = inject(DestroyRef);

  const subscribe = () => {
    subscription?.unsubscribe();
    if (!_observable$) return;

    _loading.set(true);
    _error.set(null);
    loadingCallbacks.forEach((cb) => cb(_loading()));

    subscription = _observable$
      .pipe(
        finalize(() => {
          _loading.set(false);
          loadingCallbacks.forEach((cb) => cb(_loading()));
        }),
      )
      .subscribe({
        next: (res) => {
          cached.set(pipeCallbacks.reduce((acc, cb) => cb(acc), res));
          queueMicrotask(() => {
            dataCallbacks.forEach((cb) => cb(cached()!));
          });
        },
        error: (err) => {
          _error = err;
          queueMicrotask(() => {
            errorCallbacks.forEach((cb) => cb(err));
          });
        },
        complete: () => queueMicrotask(() => completeCallbacks.forEach((cb) => cb())),
      });
  };

  if (_observable$) subscribe();

  const get = cached.asReadonly();
  const setSource = (observable$: Observable<T>) => {
    _observable$ = observable$;
    subscribe();
  };
  const hasData = () => !!cached();
  const loading = _loading.asReadonly();
  const error = _error.asReadonly();
  const reload = () => subscribe();

  const clear = () => {
    subscription?.unsubscribe();
    cached.set(initialData);
    _error.set(null);
    _loading.set(false);
    _observable$ = undefined;
  };

  const destroy = () => {
    clear();
    errorCallbacks.length = 0;
    loadingCallbacks.length = 0;
    dataCallbacks.length = 0;
    completeCallbacks.length = 0;
  };

  const onError = (cb: (error: E) => void) => {
    errorCallbacks.push(cb);
    if (_error()) cb(_error()!);
  };
  const onLoading = (cb: (loading: boolean) => void) => {
    loadingCallbacks.push(cb);
    cb(_loading());
  };
  const onData = (cb: (data: T) => void) => {
    dataCallbacks.push(cb);
    if (cached() !== undefined) cb(cached()!);
  };
  const onComplete = (cb: () => void) => completeCallbacks.push(cb);

  destroyRef.onDestroy(destroy);

  const api: AppResource<T, E> = Object.assign(get, {
    setSource,
    hasData,
    loading,
    error,
    reload,
    destroy,
    clear,
    onError,
    onLoading,
    onData,
    onComplete,
  });

  return api;
}
