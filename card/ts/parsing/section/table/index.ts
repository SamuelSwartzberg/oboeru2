import log from "loglevel";
import { Table } from "./globals";
import { parseTable } from "./parse";
import { parseTableSpecifier } from "./parse-specifier";
import { stringifyTable } from "./stringify";
import { transformTableSpecifier } from "./transform-specifier";

export function parseAsTable(
  rawHTMLText: string,
  isGroupShow: boolean
): string {
  log.setLevel("debug");
  log.debug(
    "Transforming HTML string to basic parsed table with specifiers..."
  );
  log.debug("Raw HTML text:");
  log.debug(rawHTMLText);
  const specifierNonspecifierTable = transformToNextStep(
    rawHTMLText,
    parseTable,
    true
  );
  log.debug("Parsing specifiers...");
  const parsedSpecifierTable = transformToNextStep(
    specifierNonspecifierTable,
    parseTableSpecifier,
    true
  );
  log.debug("Transforming specifiers...");
  const transformedTable = transformToNextStep(
    parsedSpecifierTable,
    transformTableSpecifier,
    true,
    isGroupShow ? ["cloze-group", "section"] : ["section"]
  );
  log.debug("Transforming table to HTML string...");
  const stringfiedTable = transformToNextStep(transformedTable, stringifyTable);
  log.setLevel("info");
  return stringfiedTable;
}

function transformToNextStep<T, U>(
  table: T,
  callback: (table: T, injectedToplevelClasses: string[]) => U,
  returnsTable: boolean = false,
  injectedToplevelClasses: string[] = []
): U {
  const result = callback(table, injectedToplevelClasses);
  log.debug("The result is:");
  if (returnsTable) {
    log.debug(JSON.stringify(result, null, 2));
    const table = result as unknown as Table<unknown>;
    warnOrErrorIfLackingRowsOrCells(table);
  } else {
    log.debug(result);
  }
  return result;
}

function warnOrErrorIfLackingRowsOrCells<T>(table: Table<T>) {
  if (!table.rows || table.rows.length === 0) {
    throw new Error("Table is empty");
  } else if (table.rows.length === 1) {
    log.warn(`Table has only one row.`);
  } else {
    table.rows.forEach((row) => {
      if (!row.cells || row.cells.length === 0) {
        throw new Error("Row is empty");
      } else if (row.cells.length === 1) {
        log.warn(`Row has only one cell.`);
      }
    });
  }
}
