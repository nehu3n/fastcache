type KeyValue = {
  key: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  value: any;
  options?: SetOptions;
};

type KeyValueResult = { [key: string]: boolean };

type SetOptions = {
  ttl?: number;
  overwrite?: boolean;
  priority?: 1 | 2 | 3;
};

export type { KeyValue, KeyValueResult, SetOptions };
