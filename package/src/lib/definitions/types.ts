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

type GetOptions = {
  fallback?: () => void;
  refreshTtl?: boolean;
};

type TypeMultipleGet = {
  key: string;
  options?: GetOptions;
};

type MultipleGetParam = TypeMultipleGet[] | string[];

export type {
  KeyValue,
  KeyValueResult,
  SetOptions,
  GetOptions,
  MultipleGetParam,
};
