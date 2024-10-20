import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  OptionsClearKeysValues,
  SetOptions,
} from "./types";

interface CacheManagerInterface {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string | number, value: any, options?: SetOptions): void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  get(key: string, options?: GetOptions): any;
  del(key: string): boolean;
  has(key: string): boolean;

  mset(keyValues: KeyValue[]): KeyValueResult;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  mget(keys: MultipleGetParam): { [key: string]: any };
  mdel(keys: string[]): KeyValueResult;
  mhas(keys: string[]): KeyValueResult;

  clear(options?: OptionsClearKeysValues): boolean;
  keys(options?: OptionsClearKeysValues): string[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  values(options?: OptionsClearKeysValues): any[];
}

export type { CacheManagerInterface };
