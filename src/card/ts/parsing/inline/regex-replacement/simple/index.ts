import { RegexAndReplacement } from "..";
import {
  buildRegexFromDelimiter,
  buildReplacementsFromReplacementDelimiters,
} from "../regex-builder";
import {
  ElementReplacement,
  getReplacementMapping,
  isStartEnd,
} from "./replacement-mapping";

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  let replacementMapping = getReplacementMapping();
  let regexAndReplacements: RegexAndReplacement[] = [];
  for (let key in replacementMapping) {
    regexAndReplacements.push(
      ...buildRegexFromMappingElement(replacementMapping[key])
    );
  }
  return regexAndReplacements;
}

function buildRegexFromMappingElement(
  element: ElementReplacement
): RegexAndReplacement[] {
  if (isStartEnd(element.delimiters)) {
    if (isStartEnd(element.replacements)) {
      return [
        [
          buildRegexThatChecksIfCharacterWasEscaped(element.delimiters.start),
          element.replacements.start,
        ],
        [
          buildRegexThatChecksIfCharacterWasEscaped(element.delimiters.end),
          element.replacements.end,
        ],
      ];
    } else
      throw new Error(
        "It's unwise to try and replace two different delimiters with the same replacement."
      );
  } else {
    // is string
    if (isStartEnd(element.replacements)) {
      return [
        [
          buildRegexFromDelimiter(element.delimiters),
          buildReplacementsFromReplacementDelimiters(element.replacements),
        ],
      ];
    } else {
      // is string
      return [
        [
          buildRegexThatChecksIfCharacterWasEscaped(element.delimiters),
          element.replacements,
        ],
      ];
    }
  }
}

function buildRegexThatChecksIfCharacterWasEscaped(character: string): RegExp {
  return new RegExp(`(?<!\\)${character}`, "g");
}
