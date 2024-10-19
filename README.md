<img src="./public/logo.png" width="100" align="right" />

> [!WARNING] 
> **FastCache** is in the development stage. It is not ready for any use at this time. ⏰

# FastCache - Key-Value Database

**FastCache** is a **blazing-fast**, **easy-to-use**, and **highly customizable** in-memory key-value database with **support for multiple caching algorithms**. It is entirely written in TypeScript and designed for **high performance** and **flexibility**. 🔥

## ✨ Features

- ⚡ **Blazing-fast performance:** Designed with **speed** in mind, **FastCache** is optimized for exceptional performance, making it ideal for applications that need fast data access. [Check out the benchmarks](./bench) to see how it compares to other cache packages in the ecosystem. **_(≈8,000,000 operations per second 🧪)_**

- 👀 **Easy-to-use API:** With a simple and intuitive API, **FastCache** offers a seamless and safe development experience, using **type-safe** TypeScript to reduce errors and make everyday work easier.

- 🎨 **Highly customizable:** Tailor your cache with options like **TTL** (Time-To-Live) and **separate namespaces**. **FastCache** is adaptable to your application's specific needs, allowing you to maximize both performance and control.

- 🚀 **Multi-algorithm support:** It supports a variety of caching algorithms such as **LRU** (Least Recently Used), **2Q**, **LFU** (Least Frequently Used), **FIFO** (First In, First Out), and **ARC** (Adaptive Replacement Cache). This allows you to choose the algorithm that best fits your data access pattern or memory requirements.

- 📂 **Persistence:** Provides an option for persistence through the file system. You can create ultra-efficient and targeted directory structures for searching, allowing you to maintain data consistency even when the application restarts.

## 📚 Guide

In this guide you will see how to use **FastCache**: its API, methods, options, explanations about each algorithm (use cases, advantages, disadvantages and description of each one) and more.

---

### Installation 📥

To install **FastCache**, use your favorite package manager:

```bash
npm install fastcache
```

```bash
pnpm add fastcache
```

```bash
yarn add fastcache
```

### API 🧩

**FastCache** provides a concise and elegant API written in TypeScript. It is type-safe and familiar in the ecosystem. The following will explain all the methods and options it contains so you can quickly get started using the package.

Let's start by looking at a basic example of a **FastCache** cache:

```ts
import { Cache } from "fastcache";
const cache = Cache({ algorithm: "LRU" });

cache.set("key", "value");

console.log(cache.get("key")); // "value"
```

Let's break this code down. First an instance of the cache is created, passing as a parameter an object with the algorithm to be used (see the [algorithms subsection](#algorithms) for explanations of the available ones):

```ts
import { Cache } from "fastcache";
const cache = Cache({ algorithm: "LRU" });
```

Then a “key” key with an associated “value” is established:

```ts
cache.set("key", "value");
```

Finally, the value set with the “key” key is obtained:

```ts
console.log(cache.get("key")); // "value"
```

#### Stores a value

To cache a value, you can use two methods depending on your needs: `set` and `mset`.

##### Set

The `set` method allows you to store **a value** associated to a key, per call. It has the syntax:

```ts
cache.set(key, value, options?);
```

Example (no options):

```ts
cache.set("key", "value");
```

The options available in the `set` are:

- `ttl?` (**number**): Specifies how long the value will remain in the cache before expiring.
- `overwrite?` (**boolean**): Whether it is allowed to overwrite existing values associated with a certain key.
- `priority?` (**1|2|3**): A number to assign a priority to the value, useful for deciding which items are deleted first in case of a full cache.

Example (with options):

```ts
cache.set("key", "value", {
  ttl: 5000, // 5 seconds (in milliseconds)
  overwrite: false,
  priority: 2
});
```

##### MSet

The `mset` (**m**ultiple **set**) method allows storing several key-values in a single call. It has the syntax:

```ts
cache.mset([ { key: value, options?: options } ]);
```

Example (no options):

```ts
cache.mset([
  { "key": "value" },
  { "key2": "value2" }
]);
```

The options available in the `mset` are:

- `ttl?` (**number**): Specifies how long the value will remain in the cache before expiring.
- `overwrite?` (**boolean**): Whether it is allowed to overwrite existing values associated with a certain key.
- `priority?` (**1|2|3**): A number to assign a priority to the value, useful for deciding which items are deleted first in case of a full cache.

Example (with options):

```ts
cache.mset([
  { "key": "value", options: { ttl: 5000, overwrite: false, priority: 2 } },
  { "key2": false },
  { "key3": 45, options: { ttl: 3000 } }
]);
```

#### Obtain a value

To get values from the cache, you can use two methods depending on your needs: `get` and `mget`.

##### Get

The `get` method allows to obtain **a value** associated to a key, per call. It has the syntax:

```ts
cache.get(key, options?);
```

Example (no options):

```ts
cache.get("key");
```

The options available in the `get` are:

- `fallback?` (**function**): A function that is executed if the value is not found in the cache. 
- `refreshTtl?` (**boolean**): Whether to refresh the TTL of the value when it is accessed.

Example (with options):

```ts
cache.get("key", {
  fallback: () => fetchValue(), // executes the fallback if the key does not exist
  refreshTtl: false,
});
```

##### MGet

The `mget` (**m**ultiple **get**) method allows to obtain several values in a single call. It has the syntax:

No options:

```ts
cache.mget([key]);
```

With options:
```ts
cache.mget([ { key, options?: options } ]);
```

Example (no options):

```ts
cache.mget(["key", "key2"]);
```

The options available in the `mget` are:

- `fallback?` (**function**): A function that is executed if the value is not found in the cache. 
- `refreshTtl?` (**boolean**): Whether to refresh the TTL of the value when it is accessed.

Example (with options):

```ts
cache.mget([
  { key: "key", options: { fallback: () => fetchValue(), refreshTtl: false } },
  { key: "key3", options: { refreshTtl: true } }
]);
```

#### Delete a value

To remove values from the cache, you can use two methods depending on your needs: `del` and `mdel`.

##### Del

The `del` method allows to delete **a value** associated to a key, per call. It has the syntax:

```ts
cache.del(key);
```

Example:

```ts
cache.del("key");
```

##### MDel

The `mdel` (**m**ultiple **del**ete) method allows to delete several values in a single call. It has the syntax:

```ts
cache.mdel([key]);
```

Example:

```ts
cache.mdel(["key", "key2"]);
```

#### Verify the existence of a value.

To verify the existence of values in the cache, you can use two methods depending on your needs: `has` and `mhas`.

##### Has

The `has` method allows you to check the existence of **a value** associated to a key, per call. It has the syntax:

```ts
cache.has(key);
```

Example:

```ts
cache.has(“key”);
```

##### MHas

The `mhas` (**m**ultiple **has**) method allows to check the existence of several values in a single call. It has the syntax:

```ts
cache.mhas([key]);
```

Example:

```ts
cache.mhas([“key”, “key2”]);
```

#### Delete all values

To clear the cache, the `clear` method is used. It has the syntax:

```ts
cache.clear(options?);
```

Example (no options):

```ts
cache.clear();
```

The options available in the `clear` are:

- `filter?` (**function**): A function that determines which elements are to be deleted.

Example (with options):

```ts
cache.clear({
  filter: (key, value) => key.startsWith('temp'), // Only values that have an associated key beginning with “temp” will be cleared.
});
```

#### Obtain all values

To get all the values from the cache, the `values` method is used. It has the syntax:

```ts
cache.values(options?);
```

Example (no options):

```ts
cache.values();
```

The options available in the `values` are:

- `filter?` (**function**): A function that determines which elements are to be obtained.

Example (with options):

```ts
cache.values({
  filter: (key, value) => key.startsWith('temp'), // Only values that have an associated key beginning with “temp” will be obtained.
});
```

#### Obtain all keys

To get all the keys from the cache, the `keys` method is used. It has the syntax:

```ts
cache.keys(options?);
```

Example (no options):

```ts
cache.keys();
```

The options available in the `keys` are:

- `filter?` (**function**): A function that determines which elements are to be obtained.

Example (with options):

```ts
cache.keys({
  filter: (key, value) => key.startsWith('temp'), // Only keys beginning with “temp” will be obtained.
});
```

### Algorithms 💿

**FastCache** has the feature of supporting multiple caching algorithms in a single shared syntax. At the moment, the supported algorithms are **LRU**, **2Q**, **LFU**, **FIFO** and **ARC**. Let's look at each of these in detail:

#### **LRU (Least Recently Used)**

**Description:**
The LRU (Least Recently Used) algorithm removes the least recently accessed items. It works well when recently accessed data is likely to be needed again.

**Advantages:**
- 👍🏼 Offers fast access with O(1) complexity for both read and write operations.
- 👍🏼 Retains the most recent elements, which suits scenarios where recent data is reused frequently.

**Disadvantages:**
- 👎🏼 Might not perform well in situations with irregular or non-linear data access, as it could evict items that are infrequently accessed but still important.

**Typical Use Cases:**
- **Frontend**: Storing recently rendered components or API request results.
- **Backend**: Caching recent user sessions or the most recent HTTP request responses.

```ts
import { Cache } from "fastcache";
const cache = Cache({ algorithm: "LRU" });

cache.set("key", "value");
console.log(cache.get("key")); // "value"
```

---

#### **2Q (Two Queues)**

**Description:**
2Q improves upon LRU by using two queues: one for newly accessed items and another for items that have been accessed more than once. This reduces cache pollution since only frequently reused items remain in memory.

**Advantages:**
- 👍🏼 Performs well in scenarios with many single-access items without displacing more relevant data.
- 👍🏼 Significantly reduces unnecessary eviction of valuable items.

**Disadvantages:**
- 👎🏼 Slightly higher memory usage compared to LRU, due to the two queues used for managing data.

**Typical Use Cases:**
- **APIs or Node.js servers**: Where many requests are unique, but some routes or data are accessed repeatedly.
- **Applications processing large data volumes**: Prevents eviction of critical items needed more than once.

```ts
const cache = Cache({ algorithm: "2Q" });
cache.set("key", "value");
console.log(cache.get("key")); // "value"
```

---

#### **LFU (Least Frequently Used)**

**Description:**
LFU removes the least frequently accessed items, retaining the most popular data. It’s ideal when there’s a clear distinction between frequently and infrequently accessed items.

**Advantages:**
- 👍🏼 Ensures the most requested data stays in the cache longer.
- 👍🏼 Great in environments where certain items are expected to have a high volume of repeated access.

**Disadvantages:**
- 👎🏼 May not adapt quickly to changes in data popularity, as it relies on historical access patterns.

**Typical Use Cases:**
- **E-commerce**: Caching frequently viewed products to deliver a faster user experience.
- **Content platforms**: Storing the most popular articles, videos, or posts.

```ts
const cache = Cache({ algorithm: "LFU" });
cache.set("key", "value");
console.log(cache.get("key")); // "value"
```

---

#### **FIFO (First In, First Out)**

**Description:**
FIFO removes the oldest item added to the cache, regardless of its access pattern. It is extremely simple and works well in scenarios where insertion order is more important than recency or frequency.

**Advantages:**
- 👍🏼 Simple implementation with predictable behavior.
- 👍🏼 Doesn’t require extra memory or complex logic.

**Disadvantages:**
- 👎🏼 Ignores data recency and usage frequency, which may lead to the eviction of still-relevant items.

**Typical Use Cases:**
- **Queue processing**: Where elements are processed in the order they were added.
- **Embedded systems**: Where simplicity and predictable performance are critical.

```ts
const cache = Cache({ algorithm: "FIFO" });
cache.set("key", "value");
console.log(cache.get("key")); // "value"
```

---

#### **ARC (Adaptive Replacement Cache)**

**Description:**
ARC is an advanced algorithm that dynamically adjusts between LRU and LFU, based on data access patterns. It monitors recent use and frequency to adapt and maximize efficiency.

**Advantages:**
- 👍🏼 Automatically adapts to different usage patterns, combining the strengths of LRU and LFU.
- 👍🏼 Optimizes performance without manual intervention or specific configuration.

**Disadvantages:**
- 👎🏼 Requires more memory and processing time compared to simpler algorithms, as it monitors data access more closely.

**Typical Use Cases:**
- **File systems**: Where data access can be both sequential and random.
- **Large or distributed applications**: Where data access patterns change frequently, requiring an adaptive approach.

```ts
const cache = Cache({ algorithm: "ARC" });
cache.set("key", "value");
console.log(cache.get("key")); // "value"
```

## 🧪 Benchmarks

You can explore the benchmarks in the [bench](./bench) folder, which includes detailed performance comparisons with other cache systems, along with analysis and visualizations. These results demonstrate how **FastCache** outperforms other solutions in the ecosystem.

## 📄 License

**FastCache** is licensed under the [MIT License](./LICENSE), allowing you the freedom to modify and distribute the code, as long as the copyright notice is retained.
