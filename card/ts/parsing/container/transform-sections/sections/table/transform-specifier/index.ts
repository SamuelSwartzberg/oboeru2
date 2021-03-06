import { Table } from "../globals";
import { ParsedSpecifer } from "../parse-specifier";

export type TransformedSpecifier<T> = {
  precreatedAttrs: {
    class: string;
    style: string;
  };
  individualSpecifiers: T;
};

export function transformTableSpecifier<T>(
  table: Table<ParsedSpecifer<T>>
): Table<TransformedSpecifier<T>> {
  table.specifier.classes = [
    "section-inner",
    "section-inner-table",
    ...table.specifier.classes,
  ];
  const newTable = {
    specifier: transformSpecifier(table.specifier),
    rows: table.rows.map((row) => {
      const newRow = {
        ...row,
        specifier: transformSpecifier(row.specifier),
        cells: row.cells.map((cell) => {
          cell.specifier.classes = cell.specifier.classes.filter(
            (arg) => arg !== "cloze-group"
          );
          const newCell = {
            ...cell,
            specifier: transformSpecifier(cell.specifier),
          };
          return newCell;
        }),
      };
      return newRow;
    }),
  };
  return newTable;
}

function transformSpecifier<T>(
  specifier: ParsedSpecifer<T>
): TransformedSpecifier<T> {
  return {
    precreatedAttrs: {
      class: specifier.classes.join(" "),
      style: mergeStyleDeclarations(specifier.style),
    },
    individualSpecifiers: specifier.individualSpecifiers,
  };
}

function mergeClasses(classes: string[]): string {
  return classes.join(" ");
}

function mergeStyleDeclarations(styleDeclarations: string[]): string {
  return styleDeclarations.join("; ");
}
