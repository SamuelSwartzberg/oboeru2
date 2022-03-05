import { getRegexReplacementPairs as getRegexReplacementPairsSimple } from "./simple";
import { getRegexReplacementPairs as getRegexReplacementPairsComplex } from "./complex";

export type RegexAndReplacement = [
  RegExp | string,
  string | ((substring: string, ...args: any[]) => string)
];

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  let simpleRegexReplacementPairs = getRegexReplacementPairsSimple();
  let complexRegexReplacementPairs = getRegexReplacementPairsComplex();
  return [...simpleRegexReplacementPairs, ...complexRegexReplacementPairs];
}
