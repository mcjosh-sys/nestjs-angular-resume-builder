import { HttpCacheService } from '../../services/cache/http-cache.service';
import { createHttpContext } from '../../utils/context-helpers';
import { HTTP_CACHE_CONTEXT_TOKEN, HttpCacheOptions } from './cache.token';

export function withCache(opts?: Omit<HttpCacheOptions, 'cache'>) {
  return createHttpContext(HTTP_CACHE_CONTEXT_TOKEN, { ...opts, cache: true });
}

export function invalidateCache(options: {
  invalidateKey?: string | string[];
  invalidateGroupKey?: string | string[];
}) {
  return createHttpContext(HTTP_CACHE_CONTEXT_TOKEN, {
    cache: false,
    ...options,
  });
}

export function invalidate(cache: HttpCacheService, options: HttpCacheOptions) {
  if (options.invalidateKey) {
    cache.invalidateKey(options.invalidateKey);
  }
  if (options.invalidateGroupKey) {
    cache.invalidateGroupKey(options.invalidateGroupKey);
  }
}
