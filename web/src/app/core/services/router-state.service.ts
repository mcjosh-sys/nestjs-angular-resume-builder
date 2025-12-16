import { computed, Injectable, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { StorageService } from './storage/storage.service';

export interface ErrorState {
  details: {
    code?: number;
    title: string;
    description: string;
  };
  redirect: {
    text: string;
    url: string;
  };
}

export interface RouterState {
  [key: string]: any;
  afterAuthRedirectUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RouterStateService {
  private readonly exceptRoutes = ['sign-in', 'sign-up', 'error', 'not-found'];
  private readonly storageKey = '_routerState';

  private _state = signal<RouterState>({});
  private _error = signal<ErrorState | null>(null);

  // derived signals
  readonly error = computed(() => this._error());
  readonly hasError = computed(() => !!this._error());
  readonly afterAuthRedirectUrl = computed(() => this._state().afterAuthRedirectUrl ?? '/');

  constructor(
    private readonly router: Router,
    private readonly storage: StorageService,
  ) {
    // hydrate state from storage
    this._state.set(this.storage.getItem<RouterState>(this.storageKey, 'Session') ?? {});

    // wire up router event listener
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        filter((event) => this.shouldCaptureAfterAuthUrl(event)),
        filter((event) => event.url !== this.afterAuthRedirectUrl()),
      )
      .subscribe((event) => {
        const route = event.url.split(/[?#]/)[0].split('/').pop() ?? '';
        this.setAfterAuthUrl(route ? event.url : '/');
      });
  }

  readonly state = this._state.asReadonly();

  private setState(data: RouterState) {
    this._state.update((state) => ({ ...state, ...data }));
    this.storage.setItem(this.storageKey, this._state(), 'Session');
  }

  setError(error: ErrorState) {
    this._error.set(error);
    this.router.navigateByUrl('error', { skipLocationChange: true });
  }

  private setAfterAuthUrl(url: string | null) {
    this.setState({ afterAuthRedirectUrl: url ?? '/' });
  }

  private shouldCaptureAfterAuthUrl(event: NavigationStart): boolean {
    const cleanUrl = event.url.split(/[?#]/)[0];
    const lastSegment = cleanUrl.split('/').filter(Boolean).pop() ?? '';
    return !this.exceptRoutes.includes(lastSegment);
  }

  clearState() {
    this._state.set({});
    this.storage.removeItem(this.storageKey, 'Session');
  }

  clearError() {
    this._error.set(null);
  }
}
