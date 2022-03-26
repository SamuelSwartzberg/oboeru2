import { Row, Table } from "../globals";
import { CellSpecifier, ParsedSpecifer, TableSpecifier } from "../parse-specifier";
import { TransformedSpecifier } from "../transform-specifier";
import { buildHTMLElement } from "./globals";

export function stringifyTable(
  table: Table<TransformedSpecifier<TableSpecifier>>
): string {
  const builtRows = table.rows.map(row => 
    buildRow(row)
  );
  const [headerRows, bodyRows] = builtRows.slice(0, table.specifier.headerrows);
  const [headerRowString, bodyRowsString] = [
    headerRows.join("\n"),
    bodyRows.join("\n"),
  ];
  const [headerRowHTML, bodyRowsHTML] = [
    buildHTMLElement("thead", {}, headerRowString),
    buildHTMLElement("tbody", {}, bodyRowsString),
  ];
  const tableHTML = buildHTMLElement("table", 
    {
      ...table.specifier.precreatedAttrs,
    },
    [headerRowHTML, bodyRowsHTML]
  );
  return tableHTML;
}

function buildRow(row: Row<TransformedSpecifier<never>>): string {
  const cells = row.cells.map((cell) => buildCell(cell));
  return buildHTMLElement("tr", {
    ...row.specifier.precreatedAttrs,
  }, cells);
}

function buildCell(cell: Cell<TransformedSpecifier<CellSpecifier>>): string {
  return buildHTMLElement(cell.individualSpecifiers.type, {
    ...cell.specifier.precreatedAttrs,
  }, [cell.contents]);