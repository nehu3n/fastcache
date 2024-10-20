import type { CacheManagerInterface } from "../definitions/interfaces";
import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  OptionsClearKeysValues,
  SetOptions,
} from "../definitions/types";

type LRUOptions = {
  ttl: number;
};

class Node {
  key: string | number;
  value: string | number | boolean | undefined;
  prev: Node | null;
  next: Node | null;

  constructor(
    key: string | number,
    value: string | number | boolean | undefined
  ) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUManager implements CacheManagerInterface {
  readonly options: LRUOptions;

  private capacity = 1e6;
  private map: Map<string | number, Node>;
  private head: Node;
  private tail: Node;
  private count: number;

  constructor(options: LRUOptions) {
    this.options = options;
    this.map = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.count = 0;
  }

  private remove(node: Node): void {
    const prevNode = node.prev;
    const nextNode = node.next;
    if (prevNode) prevNode.next = nextNode;
    if (nextNode) nextNode.prev = prevNode;
  }

  private addToHead(node: Node): void {
    node.prev = this.head;
    node.next = this.head.next;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string | number, value: any, _options?: SetOptions): void {
    if (this.map.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const existingNode = this.map.get(key)!;
      existingNode.value = value;
      this.remove(existingNode);
    } else {
      if (this.count >= this.capacity) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const lruNode = this.tail.prev!;
        this.remove(lruNode);
        this.map.delete(lruNode.key);
        this.count--;
      }
      const newNode = new Node(key, value);
      this.map.set(key, newNode);
    }
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    this.addToHead(this.map.get(key)!);
    this.count++;
  }

  get(
    key: string | number,
    _options: GetOptions
  ): string | number | boolean | undefined {
    if (!this.map.has(key)) {
      return undefined;
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const node = this.map.get(key)!;
    this.remove(node);
    this.addToHead(node);
    return node.value;
  }

  del(key: string | number): boolean {
    if (!this.map.has(key)) {
      return false;
    }

    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const node = this.map.get(key)!;
    this.remove(node);
    this.map.delete(key);
    this.count--;
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
  clear(_options?: OptionsClearKeysValues): boolean {
    throw new Error("Method not implemented.");
  }
  keys(_options?: OptionsClearKeysValues): string[] {
    throw new Error("Method not implemented.");
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  values(_options?: OptionsClearKeysValues): any[] {
    throw new Error("Method not implemented.");
  }
}

export { LRUManager };
export type { LRUOptions };
