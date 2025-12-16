export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ValueOf<T> = Prettify<T[keyof T]>;

export type KeyOf<T extends Record<string, any>> = keyof T & string;
