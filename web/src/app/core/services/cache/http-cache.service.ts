import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { queueMicrotask } from '../../utils/polyfills';
import { Duration, parseDuration } from '../../utils/time-helpers';

export interface HttpCacheEntry {
  key: string;
  groupKey?: string;
  response: HttpResponse<unknown>;
  expiresAt: number;
}

export interface SetHttpCacheParams {
  key: string;
  response: HttpResponse<unknown>;
  groupKey?: string;
  ttl?: Duration;
}

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private readonly cache = new Map<string, HttpCacheEntry>();
  private readonly groups = new Map<string, Set<string>>();
  private cleanupScheduled = false;

  constructor() {
    interval(60000 * 5)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cleanup());
  }

  get(key: string): HttpResponse<unknown> | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (this.isExpired(entry.expiresAt)) {
      this.delete(key);
      return null;
    }
    return entry.response;
  }

  set({ key, response, groupKey, ttl = '1h' }: SetHttpCacheParams): void {
    const expireAt = parseDuration(ttl) + Date.now();
    const entry: HttpCacheEntry = { key, response, expiresAt: expireAt, groupKey };
    this.cache.set(key, entry);

    if (groupKey) {
      if (!this.groups.has(groupKey)) {
        this.groups.set(groupKey, new Set());
      }
      this.groups.get(groupKey)!.add(key);
    }

    if (!this.cleanupScheduled) {
      this.cleanupScheduled = true;
      queueMicrotask(() => {
        this.cleanup();
        this.cleanupScheduled = false;
      });
    }
  }

  invalidateKey(key: string | string[]): void {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach((k) => this.delete(k));
  }

  invalidateGroupKey(groupKey: string | string[]): void {
    const groupKeys = Array.isArray(groupKey) ? groupKey : [groupKey];
    groupKeys.forEach((gk) => this.deleteByGroupKey(gk));
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deleteByGroupKey(groupKey: string): void {
    const keys = this.groups.get(groupKey);
    if (keys) {
      keys.forEach((k) => this.cache.delete(k));
      this.groups.delete(groupKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry.expiresAt)) {
        this.delete(key);
      }
    }
  }

  private isExpired(expiresAt: number) {
    return Date.now() > expiresAt;
  }
}
