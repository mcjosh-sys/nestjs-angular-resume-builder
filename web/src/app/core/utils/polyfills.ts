const _queueMicrotask = (globalThis as any).queueMicrotask;

export function queueMicrotask(fn: () => void): void {
  if (typeof _queueMicrotask === 'function') {
    _queueMicrotask(fn);
  } else {
    Promise.resolve().then(fn);
  }
}
