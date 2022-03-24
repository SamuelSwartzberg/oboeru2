import log from "loglevel";
import { StartEnd } from "./simple/replacement-mapping";

export function unescapedDelimiter(delimiter: string): string {
  return `(?<!\\\\)${delimiter}`;
}
function captureNot(delimiter: string): string {
  return `([^${delimiter}]+?)`;
}

export function buildRegexFromDelimiters(delimiter: StartEnd): RegExp {
  log.debug(`Building regex from delimiters ${JSON.stringify(delimiter)}`);
  return new RegExp(
    unescapedDelimiter(delimiter.start) +
      captureNot(delimiter.end) +
      unescapedDelimiter(delimiter.end),
    "g"
  );
}

export function buildRegexFromDelimiter(delimiter: string): RegExp {
  const delimiters = { start: delimiter, end: delimiter };
  log.debug(`Mapping delimiter ${delimiter} to ${JSON.stringify(delimiters)}`);
  return buildRegexFromDelimiters(delimiters);
}

export function buildReplacementsFromReplacementDelimiters(
  replacements: StartEnd
): string {
  return `${replacements.start}$1${replacements.end}`;
}
