import { Inject, Injectable, signal } from '@angular/core';
import { DEBUG_MODE as DEBUG_MODE_TOKEN } from '../tokens/debug-mode.token';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly debugConfig: boolean = Inject(DEBUG_MODE_TOKEN);
  private readonly debugMode = signal<boolean>(false);

  log(...args: any) {
    return console.log(...args);
  }

  warn(...args: any) {
    return console.warn(...args);
  }

  error(...args: any) {
    return console.error(...args);
  }
}
