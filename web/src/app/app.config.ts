import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { dedupInterceptor } from './core/interceptors/dedup-interceptor';
import { httpCacheInterceptor } from './core/interceptors/http-cache';
import { httpTransformInterceptor } from './core/interceptors/http-transform-interceptor';
import { provideClerk } from './core/providers/clerk.provider';
import { MetadataService } from './core/services/metadata.service';
import { PlatformService } from './core/services/platform.service';
import { RouterStateService } from './core/services/router-state.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration(),
      withHttpTransferCacheOptions({ includeRequestsWithAuthHeaders: true }),
    ),
    provideHttpClient(
      withInterceptors([dedupInterceptor, httpCacheInterceptor, httpTransformInterceptor]),
      withFetch(),
    ),
    provideClerk(),
    provideAppInitializer(() => {
      inject(MetadataService);
      inject(RouterStateService);
      inject(PlatformService);
    }),
  ],
};
