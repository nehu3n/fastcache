import type { CacheManagerInterface } from "../definitions/interfaces";
import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  OptionsClear,
  SetOptions,
} from "../definitions/types";

type LFUOptions = {
  ttl: number;
};

type LFUEntry = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value: any;
  frequency: number;
};

class LFUManager implements CacheManagerInterface {
  readonly options: LFUOptions;

  private capacity = 1e6;
  private cache: Map<string, LFUEntry>;
  private frequencyMap: Map<number, Set<string>>;
  private minFrequency: number;

  constructor(options: LFUOptions) {
    this.cache = new Map();
    this.frequencyMap = new Map();
    this.minFrequency = 0;
    this.options = options;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string, value: any, _options?: SetOptions): boolean {
    if (this.capacity <= 0) return false;

    if (this.cache.has(key)) {
      this.get(key);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      this.cache.get(key)!.value = value;
      return true;
    }

    if (this.cache.size >= this.capacity) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const keysWithMinFreq = this.frequencyMap.get(this.minFrequency)!;
      const lfuKey = keysWithMinFreq.values().next().value || "";
      this.del(lfuKey);
    }

    this.cache.set(key, { value, frequency: 1 });
    if (!this.frequencyMap.has(1)) {
      this.frequencyMap.set(1, new Set());
    }
    this.frequencyMap.get(1)?.add(key);
    this.minFrequency = 1;
    return true;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  get(key: string, _options?: GetOptions): any | undefined {
    if (!this.cache.has(key)) return undefined;

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const entry = this.cache.get(key)!;
    const { value, frequency } = entry;

    this.frequencyMap.get(frequency)?.delete(key);
    if (this.frequencyMap.get(frequency)?.size === 0) {
      this.frequencyMap.delete(frequency);
      if (this.minFrequency === frequency) {
        this.minFrequency++;
      }
    }

    const newFrequency = frequency + 1;
    entry.frequency = newFrequency;
    if (!this.frequencyMap.has(newFrequency)) {
      this.frequencyMap.set(newFrequency, new Set());
    }
    this.frequencyMap.get(newFrequency)?.add(key);

    return value;
  }

  del(key: string): boolean {
    if (!this.cache.has(key)) return false;

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const { frequency } = this.cache.get(key)!;

    this.frequencyMap.get(frequency)?.delete(key);
    if (this.frequencyMap.get(frequency)?.size === 0) {
      this.frequencyMap.delete(frequency);
      if (this.minFrequency === frequency) {
        this.minFrequency++;
      }
    }

    this.cache.delete(key);
    return true;
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
  clear(_options?: OptionsClear): boolean {
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

export { LFUManager };
export type { LFUOptions };
