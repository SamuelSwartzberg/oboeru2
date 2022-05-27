import log from "loglevel";
import { Table } from "./globals";
import { parseTable } from "./parse";
import { parseTableSpecifier } from "./parse-specifier";
import { stringifyTable } from "./stringify";
import { transformTableSpecifier } from "./transform-specifier";

export function parseAsTable(rawHTMLText: string): string {
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
    true
  );
  log.debug("Transforming table to HTML string...");
  const stringfiedTable = transformToNextStep(
    transformedTable,
    stringifyTable,
    false
  );
  return stringfiedTable;
}

function transformToNextStep<T, U>(
  table: T,
  callback: (table: T) => U,
  returnsTable: boolean = false
): U {
  const result = callback(table);
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
    throw new Error(`Table has no rows. (specifier: ${table.specifier})`);
  } else if (table.rows.length === 1) {
    log.warn(`Table only has one row.`);
  } else {
    table.rows.forEach((row) => {
      if (!row.cells || row.cells.length === 0) {
        throw new Error(`Row is empty. (specifier: ${row.specifier})`);
      } else if (row.cells.length === 1) {
        if (
          !row.specifier ||
          typeof row.specifier !== "object" ||
          !(row.specifier as {}).hasOwnProperty("span")
        ) {
          log.info(`Row only has one cell: ${JSON.stringify(row.cells[0])}`);
        }
      }
    });
  }
}
