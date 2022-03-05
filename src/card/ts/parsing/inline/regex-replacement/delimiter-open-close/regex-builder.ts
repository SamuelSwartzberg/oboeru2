import {
  isTextWrapperHTMLWrapperMapEntryDelimSpecifier,
  TextWrapperHTMLWrapperMapEntry,
  TextWrapperHTMLWrapperMapEntryDelimSpecifier,
} from ".";

function buildRegexFromDelimiters(
  delimiters: TextWrapperHTMLWrapperMapEntryDelimSpecifier
): RegExp {
  return new RegExp(
    `(?<!\\\\)${delimiters.start}([^${delimiters.end}]+?)(?<!\\\\)${delimiters.end}`,
    "g"
  );
}

function buildReplacementsFromReplacementDelimiters(
  replacements: TextWrapperHTMLWrapperMapEntryDelimSpecifier
): string {
  return `${replacements.start}$1${replacements.end}`;
}

export function buildDelimiterRegex(
  delimiters: TextWrapperHTMLWrapperMapEntry["delimiters"]
): RegExp {
  if (delimiters instanceof RegExp) return delimiters;
  else return buildRegexFromDelimiters(delimiters);
}

export function buildDelimiterReplacements(
  replacements: TextWrapperHTMLWrapperMapEntry["replacements"]
): string | ((substring: string, ...args: any[]) => string) {
  if (isTextWrapperHTMLWrapperMapEntryDelimSpecifier(replacements))
    return buildReplacementsFromReplacementDelimiters(replacements);
  else return replacements;
}
