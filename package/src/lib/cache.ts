import { TwoQManager, type TwoQOptions } from "./algorithms/2q";
import { ARCManager, type ARCOptions } from "./algorithms/arc";
import { FIFOManager, type FIFOOptions } from "./algorithms/fifo";
import { LFUManager, type LFUOptions } from "./algorithms/lfu";
import { LRUManager, type LRUOptions } from "./algorithms/lru";

import type { CacheManagerInterface } from "./definitions/interfaces";

type CacheOptions =
  | { algorithm: "LRU"; options: LRUOptions }
  | { algorithm: "2Q"; options: TwoQOptions }
  | { algorithm: "LFU"; options: LFUOptions }
  | { algorithm: "FIFO"; options: FIFOOptions }
  | { algorithm: "ARC"; options: ARCOptions };

function Cache(config: CacheOptions): CacheManagerInterface {
  const { algorithm, options } = config;

  switch (algorithm) {
    case "LRU":
      return new LRUManager(options);
    case "2Q":
      return new TwoQManager(options);
    case "LFU":
      return new LFUManager(options);
    case "FIFO":
      return new FIFOManager(options);
    case "ARC":
      return new ARCManager(options);
    default:
      throw new Error("Invalid algorithm.");
  }
}

export { Cache };
