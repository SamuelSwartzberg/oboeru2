import { getRegexReplacementPairs as getRegexReplacementPairsSimple } from "./simple";
import { getRegexReplacementPairs as getRegexReplacementPairsComplex } from "./complex";
import log from "loglevel";

type RegexOrString = RegExp | string;
type ReplacementStringOrFunc =
  | string
  | ((substring: string, ...args: any[]) => string);

export type RegexAndReplacement = [RegexOrString, ReplacementStringOrFunc];

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  log.debug("Getting regex and replacement pairs");
  let simpleRegexReplacementPairs = getRegexReplacementPairsSimple();
  let complexRegexReplacementPairs = getRegexReplacementPairsComplex();
  return [...simpleRegexReplacementPairs, ...complexRegexReplacementPairs];
}
