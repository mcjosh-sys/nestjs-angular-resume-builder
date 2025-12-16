import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Event, Router } from '@angular/router';
import { Prettify } from '@shared/models/utility.model';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Codec } from '../../utils/codecs';
import { SEARCH_PARAMS_CONFIG, SearchParamsConfig } from './search-params.config';
import { SEARCH_PARAMS_REGISTRY } from './search-params.registry';

@Injectable({ providedIn: 'root' })
export class SearchParamsService<T extends Record<string, any> = any> {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(SEARCH_PARAMS_CONFIG) private providedConfig: SearchParamsConfig<T> | null,
  ) {}

  private get currentConfig(): { codecs: Record<string, Codec<any>> } {
    if (this.providedConfig) {
      return this.providedConfig;
    }
    const root = this.route.snapshot.firstChild?.routeConfig?.path ?? '';
    return SEARCH_PARAMS_REGISTRY[root] ?? { codecs: {} };
  }

  get<K extends keyof T>(key: K): T[K] | null {
    const param = this.route.snapshot.queryParamMap.get(key.toString());
    const codec = this.currentConfig.codecs[key.toString()];
    return param !== null && codec ? codec.decode(param) : (param as any);
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    const codec = this.currentConfig.codecs[key.toString()];
    const encoded = codec ? codec.encode(value) : value;
    this.router.navigate([], {
      queryParams: { [key]: encoded },
      queryParamsHandling: 'merge',
    });
  }

  observe<K extends keyof T>(key: K): Observable<T[K] | null> {
    const codec = this.currentConfig.codecs[key.toString()];
    const observable$ = this.router.events.pipe(
      filter((e: Event) => e instanceof ActivationEnd),
      distinctUntilChanged(
        (prev, curr) =>
          JSON.stringify(prev.snapshot.queryParams) === JSON.stringify(curr.snapshot.queryParams),
      ),
      map(() => {
        const raw = this.router.routerState.snapshot.root.queryParamMap.get(key.toString());
        if (codec && raw !== null) return codec.decode(raw);
        return raw;
      }),
    );

    return observable$;
  }

  observeAll(): Observable<Prettify<Partial<T>>> {
    const codecs = this.currentConfig.codecs;
    const observable$ = this.router.events.pipe(
      filter((e: Event) => e instanceof ActivationEnd),
      distinctUntilChanged(
        (prev, curr) =>
          JSON.stringify(prev.snapshot.queryParams) === JSON.stringify(curr.snapshot.queryParams),
      ),
      map(() => {
        const params = this.router.routerState.snapshot.root.queryParamMap;
        const decoded: Record<string, any> = {};
        params.keys.forEach((key) => {
          const raw = params.get(key);
          const codec = codecs[key];
          decoded[key] = raw !== null && codec ? codec.decode(raw) : raw;
        });
        return decoded;
      }),
    );

    return observable$ as any;
  }

  remove<K extends keyof T>(key: K) {
    this.router.navigate([], {
      queryParams: { [key.toString()]: null },
      queryParamsHandling: 'merge',
    });
  }

  clear() {
    this.router.navigate([], { queryParams: {} });
  }
}
