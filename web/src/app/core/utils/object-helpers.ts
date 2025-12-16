export type AnyObject = Record<string, any>;

export type IsPlainObject<T extends AnyObject> = T extends AnyObject
  ? T extends
      | { new (...args: any[]): any }
      | Date
      | RegExp
      | Map<any, any>
      | Set<any>
      | File
      | Blob
      | FormData
      | Function
      | Array<any>
    ? false
    : true
  : false;

export type ExtractKeys<T extends AnyObject> =
  IsPlainObject<T> extends true
    ? {
        [K in Extract<keyof T, string>]: T[K] extends AnyObject
          ? K | `${K}.${ExtractKeys<T[K]>}`
          : K;
      }[Extract<keyof T, string>]
    : never;

export function getDeepValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setDeepValue(obj: any, path: string, value: any) {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => (acc[key] ??= {}), obj);
  target[lastKey] = value;
}

export function filterEmptyStrings<T extends AnyObject>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }
  if (
    typeof data === 'object' &&
    (data instanceof Date ||
      data instanceof File ||
      data instanceof Blob ||
      data instanceof FormData ||
      data instanceof Function)
  ) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((obj) => filterEmptyStrings(obj)) as unknown as T;
  }
  return Object.keys(data).reduce(
    (acc, key) => {
      const value = data[key];
      if (value === '') return acc;
      if (
        typeof value === 'object' &&
        !(
          value instanceof Date ||
          value instanceof File ||
          value instanceof Blob ||
          value instanceof FormData ||
          value instanceof Function
        )
      ) {
        acc[key] = filterEmptyStrings(value);
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  ) as T;
}
