import { Table } from "./globals";
import { parseTable } from "./parse";
import { parseTableSpecifier } from "./parse-specifier";
import { stringifyTable } from "./stringify";
import { transformTableSpecifier } from "./transform-specifier";

export function parseAsTable(
  rawHTMLText: string,
  isGroupShow: boolean
): string {
  const specifierNonspecifierTable = transformToNextStep(
    rawHTMLText,
    parseTable
  );
  const parsedSpecifierTable = transformToNextStep(
    specifierNonspecifierTable,
    parseTableSpecifier
  );
  const transformedTable = transformToNextStep(
    parsedSpecifierTable,
    transformTableSpecifier
  );
  const stringfiedTable = transformToNextStep(transformedTable, stringifyTable);
  return stringfiedTable;
}

function transformToNextStep<T, U>(
  table: T,
  //injectedToplevelClasses: string[] = []
  callback: (table: T) => U
): U {
  return callback(table);
}
