import type { CacheManagerInterface } from "../definitions/interfaces";
import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  SetOptions,
} from "../definitions/types";

type ARCOptions = {
  ttl: number;
};

class ARCManager implements CacheManagerInterface {
  readonly options: ARCOptions;

  private capacity = 1e6;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private t1: Map<string, any>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private t2: Map<string, any>;
  private b1: Set<string>;
  private b2: Set<string>;
  private p: number;

  constructor(options: ARCOptions) {
    this.options = options;
    this.t1 = new Map();
    this.t2 = new Map();
    this.b1 = new Set();
    this.b2 = new Set();
    this.p = 0;
  }

  private replace(key: string) {
    if (
      this.t1.size > 0 &&
      (this.t1.size > this.p || (this.b2.has(key) && this.t1.size === this.p))
    ) {
      const iterator = this.t1.keys();
      const next = iterator.next();

      if (!next.done) {
        const oldKey = next.value;
        this.t1.delete(oldKey);
        this.b1.add(oldKey);
      }
    } else {
      const iterator = this.t1.keys();
      const next = iterator.next();

      if (!next.done) {
        const oldKey = next.value;
        this.t2.delete(oldKey);
        this.b2.add(oldKey);
      }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string, value: any, _options?: SetOptions): boolean {
    if (this.t1.has(key) || this.t2.has(key)) {
      this.get(key);
      this.t1.get(key) ? this.t1.set(key, value) : this.t2.set(key, value);
      return true;
    }

    if (this.t1.size + this.b1.size >= this.capacity) {
      if (this.t1.size < this.capacity) {
        this.replace(key);
        this.b1.delete(this.b1.values().next().value ?? "");
      } else {
        this.replace(key);
        this.t1.delete(this.t1.keys().next().value ?? "");
      }
    } else if (
      this.t1.size + this.b1.size + this.t2.size + this.b2.size >=
      this.capacity
    ) {
      if (
        this.t1.size + this.b1.size + this.t2.size + this.b2.size >=
        2 * this.capacity
      ) {
        this.b2.delete(this.b2.values().next().value ?? "");
      }
      this.replace(key);
    }

    this.t1.set(key, value);
    return true;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  get(key: string, _options?: GetOptions): any | undefined {
    if (this.t1.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const value = this.t1.get(key)!;
      this.t1.delete(key);
      this.t2.set(key, value);
      return value;
    }

    if (this.t2.has(key)) {
      return this.t2.get(key);
    }

    if (this.b1.has(key)) {
      this.p = Math.min(this.capacity, this.p + 1);
      this.replace(key);
      this.b1.delete(key);
      this.t2.set(key, null);
      return null;
    }

    if (this.b2.has(key)) {
      this.p = Math.max(0, this.p - 1);
      this.replace(key);
      this.b2.delete(key);
      this.t2.set(key, null);
      return null;
    }

    return undefined;
  }

  del(key: string): boolean {
    if (this.t1.has(key)) {
      this.t1.delete(key);
      return true;
    }

    if (this.t2.has(key)) {
      this.t2.delete(key);
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
  mget(_keys: MultipleGetParam): { [key: string]: any } {
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

export { ARCManager };
export type { ARCOptions };
