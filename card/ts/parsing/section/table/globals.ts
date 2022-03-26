type Table<T> = {
  headerrows: Row<T>[];
  bodyrows: Row<T>[];
  specifier: T;
};

type Row<T> = {
  cells: Cell<T>[];
  specifier: T;
};

type Cell<T> = {
  contents: string;
  specifier: T;
};
