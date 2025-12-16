import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly _isBrowser = signal(false);
  private readonly _isServer = signal(false);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isBrowser = this._isBrowser.asReadonly();
  readonly isServer = this._isServer.asReadonly();

  constructor() {
    this._isBrowser.set(isPlatformBrowser(this.platformId));
    this._isServer.set(!this._isBrowser());
  }
}
