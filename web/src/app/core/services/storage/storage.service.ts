import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../tokens/window.token';

type StorageType = 'Local' | 'Session' | 'Cookie';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly localStorage!: Storage;
  private readonly sessionStorage!: Storage;

  constructor(@Inject(WINDOW) private readonly window: Window) {
    this.localStorage = this.window.localStorage;
    this.sessionStorage = this.window.sessionStorage;
  }

  getItem<T>(key: string, where: StorageType = 'Local'): T | null {
    const item =
      where === 'Session'
        ? this.sessionStorage.getItem(key)
        : where === 'Cookie'
          ? this.getCookie(key)
          : this.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  setItem<T>(key: string, value: T, where: StorageType = 'Local'): void {
    if (where === 'Session') {
      this.sessionStorage.setItem(key, JSON.stringify(value));
      return;
    }
    if (where === 'Cookie') {
      this.setCookie(key, value, 365);
      return;
    }
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string, where: StorageType = 'Local'): void {
    if (where === 'Session') {
      this.sessionStorage.removeItem(key);
      return;
    }
    if (where === 'Cookie') {
      this.setCookie(key, '', -1);
      return;
    }
    this.localStorage.removeItem(key);
  }

  clear(storage: StorageType | 'all' = 'all'): void {
    switch (storage) {
      case 'Local':
        this.localStorage.clear();
        break;
      case 'Session':
        this.sessionStorage.clear();
        break;
      case 'Cookie':
        this.window.document.cookie.split(';').forEach((c) => {
          this.window.document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        break;
      case 'all':
        this.localStorage.clear();
        this.sessionStorage.clear();
        break;
      default:
        break;
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private setCookie(name: string, value: any, days: number) {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
  }
}
