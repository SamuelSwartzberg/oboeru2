import { StartEnd } from "./simple/replacement-mapping";

export function buildRegexFromDelimiters(delimiter: StartEnd): RegExp {
  return new RegExp(
    `(?<!\\\\)${delimiter.start}([^${delimiter.start}]+?)(?<!\\\\)${delimiter.end}`,
    "g"
  );
}

export function buildRegexFromDelimiter(delimiter: string): RegExp {
  return buildRegexFromDelimiters({ start: delimiter, end: delimiter });
}

export function buildReplacementsFromReplacementDelimiters(
  replacements: StartEnd
): string {
  return `${replacements.start}$1${replacements.end}`;
}
