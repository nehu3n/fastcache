import type { CacheManagerInterface } from "../definitions/interfaces";
import type { KeyValue, KeyValueResult } from "../definitions/types";

type FIFOOptions = {
  ttl: number;
};

class FIFOManager implements CacheManagerInterface {
  readonly options: FIFOOptions;
  private capacity = 1e6;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private cache: Map<string, any>;
  private order: string[];

  constructor(options: FIFOOptions) {
    this.options = options;
    this.cache = new Map();
    this.order = [];
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string, value: any): boolean {
    if (this.cache.has(key)) {
      this.cache.set(key, value);
      return true;
    }

    if (this.cache.size >= this.capacity) {
      const oldestKey = this.order.shift();
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, value);
    this.order.push(key);
    return true;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  get(key: string): any | undefined {
    return this.cache.get(key);
  }

  del(key: string): boolean {
    if (this.cache.has(key)) {
      this.cache.delete(key);
      const index = this.order.indexOf(key);
      if (index > -1) {
        this.order.splice(index, 1);
      }
      return true;
    }
    return false;
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
