import { InjectionToken } from '@angular/core';
import { Codec } from '../../utils/codecs';

export interface SearchParamsConfig<T extends Record<string, Codec<any>>> {
  codecs: T;
}

export const SEARCH_PARAMS_CONFIG = new InjectionToken<SearchParamsConfig<any> | null>(
  'SEARCH_PARAMS_CONFIG',
  {
    providedIn: 'root',
    factory: () => null,
  },
);
