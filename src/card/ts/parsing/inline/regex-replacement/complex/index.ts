import { RegexAndReplacement } from "..";
import { buildRegexFromDelimiters } from "../regex-builder";
import { StartEnd } from "../simple/replacement-mapping";
import { keyReplacementFunction } from "./key";

function buildRubyRegex(): RegexAndReplacement {
  return [
    /(?<!\\)　(?<!\\)([^（]+)（([^）]+)(?<!\\)/g,
    function replacements(_, rubyBottom: string, rubyTop: string): string {
      return `<ruby>${rubyBottom}<rp>（</rp><rt>${rubyTop}</rt><rp>）</rp></ruby>`;
    },
  ];
}

function buldKbdRegex(): RegexAndReplacement {
  return [
    buildRegexFromDelimiters({
      start: "⟦",
      end: "⟧",
    } as StartEnd),
    keyReplacementFunction,
  ];
}

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  return [buildRubyRegex(), buldKbdRegex()];
}
