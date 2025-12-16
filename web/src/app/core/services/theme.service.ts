import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { PlatformService } from './platform.service';
import { RequestContextService } from './request-context.service';
import { StorageService } from './storage/storage.service';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platform = inject(PlatformService);
  private readonly storage = inject(StorageService);
  private readonly reqContext = inject(RequestContextService);
  private readonly document = inject(DOCUMENT);

  private readonly _theme = signal<Theme>('system');
  private readonly _isSystemDark = signal(false);

  readonly currentTheme = computed(() => {
    return this._theme() === 'system' ? (this._isSystemDark() ? 'dark' : 'light') : this._theme();
  });
  readonly isDarkMode = computed(() => this.currentTheme() === 'dark');
  readonly isBrowser = this.platform.isBrowser;

  constructor() {
    // const serverTheme = this.reqContext.theme;
    // if (serverTheme) {
    //   this._theme.set(serverTheme);
    //   this.applyTheme(serverTheme);
    //   return;
    // }
    if (!this.platform.isBrowser()) return;

    const stored = this.storage.getItem<Theme>('theme', 'Cookie');
    if (stored) this._theme.set(stored);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    this._isSystemDark.set(mql.matches);
    const listener = (e: MediaQueryListEvent) => this._isSystemDark.set(e.matches);
    mql.addEventListener('change', listener);

    effect(() => {
      this.applyTheme(this.currentTheme());
    });

    effect((onCleanup) => {
      onCleanup(() => mql.removeEventListener('change', listener));
    });
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
    this.platform.isBrowser() && this.storage.setItem('theme', theme, 'Cookie');
  }

  toggleTheme() {
    if (this._theme() === 'light') this.setTheme('dark');
    else if (this._theme() === 'dark') this.setTheme('light');
    else this.setTheme(this._isSystemDark() ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme) {
    this.document.documentElement.classList.toggle('dark', theme === 'dark');
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}
