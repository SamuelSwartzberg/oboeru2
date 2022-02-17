import { getTextWrapperHTMLWrapperMap } from "./replacement-mapping";
import {
  buildRegex,
  buildReplacements,
} from "./replacement-mapping/regex-builder";

export function getRegexReplacementPairs(): [
  RegExp,
  string | ((substring: string, ...args: any[]) => string)
][] {
  return Object.values(getTextWrapperHTMLWrapperMap).map((value) => {
    return [
      buildRegex(value.delimiters),
      buildReplacements(value.replacements),
    ];
  });
}
