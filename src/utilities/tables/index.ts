import { buildTable } from "./build-table";
import { parseTable } from "./parse-table";

export function padTable(raw: string): string {
  const table = parseTable(raw);
  const paddedTable = buildTable(table);
  return paddedTable;
}
