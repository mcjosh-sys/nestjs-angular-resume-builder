import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { HttpCacheService } from '../../services/cache/http-cache.service';
import { HTTP_CACHE_CONTEXT_TOKEN } from './cache.token';
import { invalidate } from './helpers';

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const context = req.context.get(HTTP_CACHE_CONTEXT_TOKEN);
  if (!context) return next(req);
  const cache = inject(HttpCacheService);
  let _invalidate = () => {};
  if (context.invalidateGroupKey || context.invalidateKey) {
    _invalidate = () => invalidate(cache, context);
  }
  if (!context.cache || req.method !== 'GET') {
    return next(req).pipe(tap(() => _invalidate()));
  }
  if (req.method === 'GET') {
    _invalidate();
    _invalidate = () => {};
  }
  const key = context.key ?? req.urlWithParams;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    return of(cachedResponse);
  }
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        _invalidate();
        cache.set({
          key,
          response: event,
          groupKey: context.groupKey,
          ttl: context.ttl,
        });
      }
    }),
  );
};
