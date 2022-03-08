import { markdownTable } from "markdown-table";

export function buildTable(table: string[][]): string {
  return markdownTable(table, {
    delimiterEnd: false,
    delimiterStart: false,
    padding: false,
  });
}
