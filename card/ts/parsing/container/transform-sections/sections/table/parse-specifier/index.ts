import { Table } from "../globals";
import { Specifiers } from "../parse";
import { parseSpecifier } from "./parse-action-mappings";

export type ParsedSpecifer<T> = {
  classes: string[];
  style: string[];
  individualSpecifiers: T;
};

export type InnerSpecifier = {
  headerrows: number;
  span?: SpanSpecifierInner;
  type?: string;
};

export type SpanSpecifierInner = {
  col: number;
  row: number;
};

export function parseTableSpecifier(
  table: Table<Specifiers>
): Table<ParsedSpecifer<InnerSpecifier>> {
  const newTable = {
    specifier: parseSpecifier(table.specifier),
    rows: table.rows.map((row) => {
      const newRow = {
        ...row,
        specifier: parseSpecifier(row.specifier),
        cells: row.cells.map((cell) => {
          const newCell = {
            ...cell,
            specifier: parseSpecifier(cell.specifier),
          };
          return newCell;
        }),
      };
      return newRow;
    }),
  };
  for (
    let index = 0;
    index < newTable.specifier.individualSpecifiers.headerrows;
    index++
  ) {
    newTable.rows[index].specifier.classes = newTable.rows[
      index
    ].specifier.classes.filter((ele) => ele !== "cloze-group");
  }
  return newTable;
}

// TODO ! means group show, anything that doesn't have it gets cloze-group
