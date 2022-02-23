import { getTextWrapperHTMLWrapperMap } from "./delimiter-open-close";
import {
  buildDelimiterRegex,
  buildDelimiterReplacements,
} from "./delimiter-open-close/regex-builder";
import { getElementAndReplacement } from "./single-element";

type RegexAndReplacement = [
  RegExp | string,
  string | ((substring: string, ...args: any[]) => string)
];

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  let delimiterRegexReplacement: RegexAndReplacement[] = Object.values(
    getTextWrapperHTMLWrapperMap()
  ).map((value) => {
    return [
      buildDelimiterRegex(value.delimiters),
      buildDelimiterReplacements(value.replacements),
    ];
  });
  let elementRegexReplacement: RegexAndReplacement[] =
    getElementAndReplacement();
  return [...delimiterRegexReplacement, ...elementRegexReplacement];
}
