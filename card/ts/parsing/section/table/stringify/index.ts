import { Cell, Row, Table } from "../globals";
import { InnerSpecifier } from "../parse-specifier";
import { TransformedSpecifier } from "../transform-specifier";
import {
  buildHTMLElement,
  transformSpanSpecifierInnerToAttributes,
} from "./globals";

export function stringifyTable(
  table: Table<TransformedSpecifier<InnerSpecifier>>
): string {
  const builtRows = table.rows.map((row) => buildRow(row));
  const [headerRows, bodyRows] = [
    builtRows.slice(0, table.specifier.individualSpecifiers.headerrows || 1),
    builtRows.slice(table.specifier.individualSpecifiers.headerrows || 1),
  ];
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

function buildRow(row: Row<TransformedSpecifier<InnerSpecifier>>): string {
  const cells = row.cells.map((cell) => buildCell(cell));
  return buildHTMLElement(
    "tr",
    {
      ...row.specifier.precreatedAttrs,
    },
    cells
  );
}

function buildCell(cell: Cell<TransformedSpecifier<InnerSpecifier>>): string {
  return buildHTMLElement(
    cell.specifier.individualSpecifiers.type || "tr",
    {
      ...cell.specifier.precreatedAttrs,
      ...transformSpanSpecifierInnerToAttributes(
        cell.specifier.individualSpecifiers.span
      ),
    },
    [cell.contents]
  );
}
