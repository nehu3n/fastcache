import { Bench } from "tinybench";

import NodeCache from "node-cache";
import { LRUCache } from "lru-cache";
import { FlatCache } from "flat-cache";
import { Cache } from "../../package/dist/index.js";

const nodeCache = new NodeCache();
const lruCache = new LRUCache({ max: 1000 });
const flatCache = new FlatCache();
const fastCache = Cache({
  algorithm: "LFU",
  options: { ttl: 0 },
});

const testKey = "testKey";
const testValue = "testValue";

(async () => {
  const bench = new Bench();

  bench.add("FastCache set()", () => {
    fastCache.set(testKey, testValue);
  });

  bench.add("NodeCache set()", () => {
    nodeCache.set(testKey, testValue);
  });

  bench.add("LRUCache set()", () => {
    lruCache.set(testKey, testValue);
  });

  bench.add("FlatCache set()", () => {
    flatCache.setKey(testKey, testValue);
  });

  bench.add("FastCache get()", () => {
    fastCache.get(testKey);
  });

  bench.add("NodeCache get()", () => {
    nodeCache.get(testKey);
  });

  bench.add("LRUCache get()", () => {
    lruCache.get(testKey);
  });

  bench.add("FlatCache get()", () => {
    flatCache.getKey(testKey);
  });

  bench.add("FastCache delete()", () => {
    fastCache.del(testKey);
  });

  bench.add("NodeCache delete()", () => {
    nodeCache.del(testKey);
  });

  bench.add("LRUCache delete()", () => {
    lruCache.delete(testKey);
  });

  bench.add("FlatCache delete()", () => {
    flatCache.removeKey(testKey);
  });

  await bench.run();
  console.table(bench.table());
})();
