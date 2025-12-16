import { Injectable } from '@angular/core';
import { finalize, Observable, Subject } from 'rxjs';

export type AppEvent<Key extends string = string, Payload = undefined> = Payload extends undefined
  ? { key: Key; payload?: Payload }
  : { key: Key; payload: Payload };

export type AppEventFromMap<
  EventMap extends Record<string, any>,
  K extends keyof EventMap & string,
> = AppEvent<K, EventMap[K]>;

@Injectable({
  providedIn: 'root',
})
export class EventBusService<T extends Record<string, any> = Record<string, any>> {
  private readonly channels = new Map<string, Subject<T[keyof T]>>();
  private readonly all = new Subject<{ key: string; payload?: any }>();
  private readonly listeners = new Map<string, number>();

  emit<Event extends Record<string, any> = T, K extends keyof Event & string = string>(
    key: K,
    ...payload: T[K] extends undefined | null ? [] : [T[K]]
  ) {
    const channel = this.channels.get(key);
    if (channel) {
      const value = payload[0];
      channel.next(value as T[K]);
      this.all.next({ key, payload: value });
    }
  }

  on<Event extends Record<string, any> = T, K extends keyof Event & string = string>(
    key: K,
  ): Observable<T[K]> {
    this.listeners.set(key, (this.listeners.get(key) ?? 0) + 1);
    let channel$ = this.channels.get(key);
    if (!channel$) {
      channel$ = new Subject<T[keyof T]>();
      this.channels.set(key, channel$);
    }

    return channel$.asObservable().pipe(finalize(() => this.cleanup(key))) as any;
  }

  onAll() {
    return this.all.asObservable();
  }

  private cleanup(key: string) {
    const listener = this.listeners.get(key);
    if (listener && listener > 0) {
      this.listeners.set(key, listener - 1);
    } else if (listener) {
      this.listeners.delete(key);
      this.channels.get(key)?.complete();
      this.channels.delete(key);
    }
  }
}
