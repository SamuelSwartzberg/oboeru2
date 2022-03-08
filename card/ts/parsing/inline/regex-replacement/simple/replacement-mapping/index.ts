import replacementMapping from "replacement-mapping.json";

export interface ElementReplacement {
  delimiters: string | StartEnd;
  replacements: string | StartEnd;
}

interface ElementReplacementMapping {
  [key: string]: ElementReplacement;
}

export interface StartEnd {
  start: string;
  end: string;
}

export function isStartEnd(value: any): value is StartEnd {
  return (
    typeof value === "object" &&
    value !== null &&
    "start" in value &&
    "end" in value
  );
}

export function getReplacementMapping(): ElementReplacementMapping {
  let mdStyleEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.mdStyle
  );
  let escapeEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.escapes
  );
  return Object.fromEntries([...mdStyleEntries, ...escapeEntries]);
}
