export interface Codec<T> {
  encode(value: T): string;
  decode(value: string): T;
}

export const stringCodec: Codec<string> = {
  encode: (v) => v,
  decode: (v) => v,
};

export const numberCodec: Codec<number> = {
  encode: (v) => v.toString(),
  decode: (v) => Number(v),
};

export const booleanCodec: Codec<boolean> = {
  encode: (v) => (v ? '1' : '0'),
  decode: (v) => v === '1',
};

export const arrayCommaCodec: Codec<string[]> = {
  encode: (arr) => arr.join(','),
  decode: (v) => (v ? v.split(',') : []),
};

export const jsonCodec: Codec<any> = {
  encode: (v) => JSON.stringify(v),
  decode: (v) => JSON.parse(v),
};
