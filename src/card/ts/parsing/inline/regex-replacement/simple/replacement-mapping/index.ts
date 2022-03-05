import replacementMappingping from "replacement-mapping.json";

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
  return replacementMappingping;
}
