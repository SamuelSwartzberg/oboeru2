export type Table<T> = {
  rows: Row<T>[];
  specifier: T;
};

export type Row<T> = {
  cells: Cell<T>[];
  specifier: T;
};

export type Cell<T> = {
  contents: string;
  specifier: T;
};
