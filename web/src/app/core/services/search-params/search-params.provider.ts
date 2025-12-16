import { Provider } from '@angular/core';
import { SEARCH_PARAMS_CONFIG, SearchParamsConfig } from './search-params.config';
import { SearchParamsService } from './search-params.service';

export function provideSearchParams<T extends Record<string, any>>(
  codecs: SearchParamsConfig<T>['codecs'] | null = null,
): Provider[] {
  return [
    { provide: SEARCH_PARAMS_CONFIG, useValue: { codecs } },
    { provide: SearchParamsService, useClass: SearchParamsService },
  ];
}
