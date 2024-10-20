import type { CacheManagerInterface } from "../definitions/interfaces";
import type {
  GetOptions,
  KeyValue,
  KeyValueResult,
  MultipleGetParam,
  OptionsClear,
  SetOptions,
} from "../definitions/types";

type TwoQOptions = {
  ttl: number;
};

class Node {
  key: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value: any;
  prev: Node | null = null;
  next: Node | null = null;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}

class TwoQManager implements CacheManagerInterface {
  readonly options: TwoQOptions;
  private maxSize: number;
  private inQueue: Map<string, Node>;
  private outQueue: Map<string, Node>;
  private mainQueue: Map<string, Node>;
  private inHead: Node;
  private inTail: Node;
  private mainHead: Node;
  private mainTail: Node;

  constructor(options: TwoQOptions) {
    this.options = options;
    this.maxSize = 1e6;

    this.inQueue = new Map();
    this.outQueue = new Map();
    this.mainQueue = new Map();

    this.inHead = new Node("", null);
    this.inTail = new Node("", null);
    this.inHead.next = this.inTail;
    this.inTail.prev = this.inHead;

    this.mainHead = new Node("", null);
    this.mainTail = new Node("", null);
    this.mainHead.next = this.mainTail;
    this.mainTail.prev = this.mainHead;
  }

  private removeNode(node: Node): void {
    const prevNode = node.prev;
    const nextNode = node.next;
    if (prevNode) prevNode.next = nextNode;
    if (nextNode) nextNode.prev = prevNode;
  }

  private addToHead(node: Node, head: Node): void {
    node.prev = head;
    node.next = head.next;
    if (head.next) head.next.prev = node;
    head.next = node;
  }

  private evictFromInQueue(): void {
    const lruNode = this.inTail.prev;
    if (lruNode && lruNode !== this.inHead) {
      this.removeNode(lruNode);
      this.inQueue.delete(lruNode.key);
      this.outQueue.set(lruNode.key, lruNode);
    }
  }

  private evictFromMainQueue(): void {
    const lruNode = this.mainTail.prev;
    if (lruNode && lruNode !== this.mainHead) {
      this.removeNode(lruNode);
      this.mainQueue.delete(lruNode.key);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string, value: any, _options?: SetOptions): boolean {
    if (this.mainQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.mainQueue.get(key)!;
      node.value = value;
      this.removeNode(node);
      this.addToHead(node, this.mainHead);
    } else if (this.inQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.inQueue.get(key)!;
      node.value = value;
      this.removeNode(node);
      this.inQueue.delete(key);
      this.mainQueue.set(key, node);
      this.addToHead(node, this.mainHead);

      if (this.mainQueue.size > this.maxSize / 2) {
        this.evictFromMainQueue();
      }
    } else {
      const node = new Node(key, value);
      this.inQueue.set(key, node);
      this.addToHead(node, this.inHead);

      if (this.inQueue.size > this.maxSize / 2) {
        this.evictFromInQueue();
      }
    }
    return true;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  get(key: string, _options?: GetOptions): any | undefined {
    if (this.mainQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.mainQueue.get(key)!;
      this.removeNode(node);
      this.addToHead(node, this.mainHead);
      return node.value;
    }
    if (this.outQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.outQueue.get(key)!;
      this.outQueue.delete(key);
      this.inQueue.set(key, node);
      this.addToHead(node, this.inHead);
      return node.value;
    }
    return undefined;
  }

  del(key: string): boolean {
    if (this.mainQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.mainQueue.get(key)!;
      this.removeNode(node);
      this.mainQueue.delete(key);
      return true;
    }
    if (this.inQueue.has(key)) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const node = this.inQueue.get(key)!;
      this.removeNode(node);
      this.inQueue.delete(key);
      return true;
    }
    if (this.outQueue.has(key)) {
      this.outQueue.delete(key);
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

export { TwoQManager };
export type { TwoQOptions };
