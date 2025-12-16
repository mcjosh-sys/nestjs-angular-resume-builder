import { HttpContextToken } from '@angular/common/http';
import { Duration } from '../../utils/time-helpers';

export interface HttpCacheOptions {
  cache: boolean;
  key?: string;
  ttl?: Duration;
  invalidateKey?: string | string[];
  groupKey?: string;
  invalidateGroupKey?: string | string[];
}

export const HTTP_CACHE_CONTEXT_TOKEN = new HttpContextToken<HttpCacheOptions>(() => ({
  cache: false,
}));
