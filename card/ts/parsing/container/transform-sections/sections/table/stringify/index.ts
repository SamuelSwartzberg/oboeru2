import { Cell, Row, Table } from "../globals";
import { InnerSpecifier } from "../parse-specifier";
import { TransformedSpecifier } from "../transform-specifier";
import {
  buildHTMLElement,
  transformSpanSpecifierInnerToAttributes,
} from "./globals";

export function stringifyTable(
  table: Table<TransformedSpecifier<InnerSpecifier>>,
  injectedToplevelClasses: string[] = []
): string {
  return buildHTMLElement(
    "section",
    {
      class: injectedToplevelClasses.join(" "),
    },
    [buildTable(table)]
  );
}

function buildTable(
  table: Table<TransformedSpecifier<InnerSpecifier>>
): string {
  const headerRows = table.rows
    .slice(0, table.specifier.individualSpecifiers.headerrows)
    .map((row) => buildRow(row, "th"));
  const bodyRows = table.rows
    .slice(table.specifier.individualSpecifiers.headerrows)
    .map((row) => buildRow(row, "td"));
  const [headerRowHTML, bodyRowsHTML] = [
    buildHTMLElement("thead", {}, headerRows),
    buildHTMLElement("tbody", {}, bodyRows),
  ];
  const tableHTML = buildHTMLElement(
    "table",
    {
      ...table.specifier.precreatedAttrs,
    },
    [headerRowHTML, bodyRowsHTML]
  );
  return tableHTML;
}

function buildRow(
  row: Row<TransformedSpecifier<InnerSpecifier>>,
  defaultCellType: string
): string {
  const cells = row.cells.map((cell) => buildCell(cell, defaultCellType));
  return buildHTMLElement(
    "tr",
    {
      ...row.specifier.precreatedAttrs,
    },
    cells
  );
}

function buildCell(
  cell: Cell<TransformedSpecifier<InnerSpecifier>>,
  defaultCellType: string
): string {
  return buildHTMLElement(
    cell.specifier.individualSpecifiers.type || defaultCellType,
    {
      ...cell.specifier.precreatedAttrs,
      ...transformSpanSpecifierInnerToAttributes(
        cell.specifier.individualSpecifiers.span
      ),
    },
    [cell.contents]
  );
}
