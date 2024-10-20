import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  OptionsClear,
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

  clear(options?: OptionsClear): boolean;
  keys(): string[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  values(): any[];
}

export type { CacheManagerInterface };
