import type { CacheManagerInterface } from "../definitions/interfaces";
import type { KeyValue, KeyValueResult } from "../definitions/types";

type FIFOOptions = {
  ttl: number;
}

class FIFOManager implements CacheManagerInterface {
  readonly options: FIFOOptions;

  constructor(options: FIFOOptions) {
    this.options = options;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(_key: string, _value: any): boolean {
    throw new Error("Method not implemented.");
  }
  get(_key: string) {
    throw new Error("Method not implemented.");
  }
  del(_key: string): boolean {
    throw new Error("Method not implemented.");
  }
  has(_key: string): boolean {
    throw new Error("Method not implemented.");
  }
  mset(_keyValues: KeyValue[]): KeyValueResult {
    throw new Error("Method not implemented.");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  mget(_keys: string[]): { [key: string]: any } {
    throw new Error("Method not implemented.");
  }
  mdel(_keys: string[]): KeyValueResult {
    throw new Error("Method not implemented.");
  }
  mhas(_keys: string[]): KeyValueResult {
    throw new Error("Method not implemented.");
  }
  clear(): boolean {
    throw new Error("Method not implemented.");
  }
  keys(): string[] {
    throw new Error("Method not implemented.");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  values(): any[] {
    throw new Error("Method not implemented.");
  }
}

export { FIFOManager };
export type { FIFOOptions };