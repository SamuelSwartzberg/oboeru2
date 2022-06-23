import log from "loglevel";
import { matchNotEscaped } from "../../../globals/regex";
import { StartEnd } from "./simple/replacement-mapping";

function captureNot(delimiter: string): string {
  return `([^${delimiter}]+?)`;
}

export function buildRegexFromDelimiters(delimiter: StartEnd): RegExp {
  log.debug(`Building regex from delimiters ${JSON.stringify(delimiter)}`);
  const regexContents =
    matchNotEscaped(delimiter.start) +
    captureNot(delimiter.end) +
    matchNotEscaped(delimiter.end);
  const regex = new RegExp(regexContents, "g");
  log.debug(`Built regex ${regex}`);
  return regex;
}

export function buildRegexFromDelimiter(delimiter: string): RegExp {
  const delimiters = { start: delimiter, end: delimiter };
  log.debug(`Mapping delimiter ${delimiter} to ${JSON.stringify(delimiters)}`);
  const regexFromDelimiter = buildRegexFromDelimiters(delimiters);
  if (!regexFromDelimiter || !(regexFromDelimiter instanceof RegExp)) {
    throw new Error(`Could not build regex from delimiter ${delimiter}`);
  }
  return regexFromDelimiter;
}

export function buildReplacementsFromReplacementDelimiters(
  replacements: StartEnd
): string {
  return `${replacements.start}$1${replacements.end}`;
}
