import log from "loglevel";
import { RegexAndReplacement } from "..";
import {
  buildRegexFromDelimiter,
  buildReplacementsFromReplacementDelimiters,
  unescapedDelimiter,
} from "../regex-builder";
import {
  ElementReplacement,
  getReplacementMapping,
  isStartEnd,
} from "./replacement-mapping";

export function getRegexReplacementPairs(): RegexAndReplacement[] {
  log.debug(
    "Getting regex and replacement pairs for simple ones (i.e. those without logic which can be parsed from a json file)."
  );
  let replacementMapping = getReplacementMapping();
  log.debug(
    "Loaded replacement mapping with " +
      replacementMapping.length +
      " elements."
  );
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
  log.debug(
    "Calling buildRegexFromMappingElement(), which disambiguates how to build the regex depending on whether delimiters & replacements are a StartEnd or a string."
  );
  log.debug("The element is " + JSON.stringify(element));
  if (isStartEnd(element.delimiters)) {
    if (isStartEnd(element.replacements)) {
      log.debug("Both delimiters and replacements are StartEnd.");
      return [
        [
          unescapedDelimiter(element.delimiters.start),
          element.replacements.start,
        ],
        [unescapedDelimiter(element.delimiters.end), element.replacements.end],
      ];
    } else
      throw new Error(
        "delimiters is StartEnd but replacements is a string. It's unwise to try and replace two different delimiters with the same replacement."
      );
  } else {
    // is string
    if (isStartEnd(element.replacements)) {
      log.debug("Delimiters is a string and replacements is StartEnd.");
      return [
        [
          buildRegexFromDelimiter(element.delimiters),
          buildReplacementsFromReplacementDelimiters(element.replacements),
        ],
      ];
    } else {
      // is string
      log.debug("Both delimiters and replacements are strings.");
      return [[unescapedDelimiter(element.delimiters), element.replacements]];
    }
  }
}
