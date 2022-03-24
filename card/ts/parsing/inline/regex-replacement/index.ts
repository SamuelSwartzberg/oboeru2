import { getRegexReplacementPairs as getRegexReplacementPairsSimple } from "./simple";
import { getRegexReplacementPairs as getRegexReplacementPairsComplex } from "./complex";
import log from "loglevel";

export type RegexAndReplacement = [
  RegExp | string,
  string | ((substring: string, ...args: any[]) => string)
];

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  log.debug("Getting regex and replacement pairs");
  let simpleRegexReplacementPairs = getRegexReplacementPairsSimple();
  let complexRegexReplacementPairs = getRegexReplacementPairsComplex();
  return [...simpleRegexReplacementPairs, ...complexRegexReplacementPairs];
}
