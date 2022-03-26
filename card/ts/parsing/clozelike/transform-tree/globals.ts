export type TreeElement<T> = {
  value: string | [string, string];
  children: TreeElement<T>[];
  contents: T;
};
