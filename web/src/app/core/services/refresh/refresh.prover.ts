import { InjectionToken, Provider } from '@angular/core';
import { EventBusService } from './event-bus.service';

export const REFRESH_TOKEN = new InjectionToken<string>('refresh');

export function provideRefreshService(basePath: string): Provider[] {
  return [
    {
      provide: REFRESH_TOKEN,
      useValue: basePath,
    },
    {
      provide: EventBusService,
    },
  ];
}
