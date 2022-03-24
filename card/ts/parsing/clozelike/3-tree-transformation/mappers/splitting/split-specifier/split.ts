import { isActionMapping } from "../globals";

function separateIntoActionMappingsAndNonspecifierInner(
  parts: string[]
): [string[], string] {
  let actionMappings: string[] = [];
  while (parts.length > 0) {
    const part = parts.shift() as string;
    if (isActionMapping(part)) {
      actionMappings.push(part);
    } else {
      return [actionMappings, parts.join(";")];
    }
  }
  throw new Error(
    "No-non action mappings found, ergo the clozelike has no content, which should not be possible."
  );
}

export function separateIntoActionMappingsAndNonspecifier(
  str: string
): [string[], string] {
  const parts = str.split(";");
  return separateIntoActionMappingsAndNonspecifierInner(parts);
}
