export function countLeadingHashSigns(line: string): number {
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== "#") return i;
  }
  return 0;
}

export function parseHeaderIntoFlagsAndContent(
  line: string,
  amountOfLeadingHashSigns: number
): [string, boolean] {
  line = line.slice(amountOfLeadingHashSigns);
  let isGroupShowHeader = false;
  if (line.startsWith(" !")) {
    isGroupShowHeader = true;
    line = line.slice(2);
  }
  return [line.trim(), isGroupShowHeader];
}
