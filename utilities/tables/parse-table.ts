export function parseTable(raw: string): string[][] {

  return raw.split("\n").map((row) => row.split("|"));
}
