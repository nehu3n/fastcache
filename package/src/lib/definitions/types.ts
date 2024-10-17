type KeyValue = {
    key: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    value: any;
}

type KeyValueResult = { [key: string]: boolean };

export type { KeyValue, KeyValueResult }