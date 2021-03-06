import { StructuredElementReplacementMap } from "./replacement-mapping";
import replacementMapping from "./replacement-mapping.json";

export interface ElementReplacement {
  delimiters: string | StartEnd;
  replacements: string | StartEnd;
}

export type ElementReplacementDelimitersSE = ElementReplacement & {
  delimiters: StartEnd;
};
export type ElementReplacementDelimitersString = ElementReplacement & {
  delimiters: string;
};

export interface ElementReplacementMap {
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

export function getReplacementMapping(): ElementReplacementMap {
  let mdStyleEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.mdStyle
  );
  let escapeEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.escapes
  );
  let ebnfEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.ebnf
  );
  return Object.fromEntries([
    ...mdStyleEntries,
    ...escapeEntries,
    ...ebnfEntries,
  ]);
}

export function getReplacementMappingUnflattened(): StructuredElementReplacementMap {
  return replacementMapping;
}
