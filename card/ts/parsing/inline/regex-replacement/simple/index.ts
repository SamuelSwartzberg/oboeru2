import log from "loglevel";
import { RegexAndReplacement } from "..";
import {
  buildRegexFromDelimiter,
  buildReplacementsFromReplacementDelimiters,
  unescapedDelimiter,
} from "../regex-builder";
import {
  ElementReplacement,
  ElementReplacementDelimitersSE,
  ElementReplacementDelimitersString,
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
  log.debug("The simple regex and replacement pairs are:");
  log.debug(JSON.stringify(regexAndReplacements, null, 2));
  return regexAndReplacements;
}

function buildRegexFromMappingElement(
  element: ElementReplacement
): [RegexAndReplacement, RegexAndReplacement] | [RegexAndReplacement] {
  log.debug(
    "Calling buildRegexFromMappingElement(), which disambiguates how to build the regex depending on whether delimiters & replacements are a StartEnd or a string."
  );
  log.debug("The element is " + JSON.stringify(element));
  let regexAndReplacements:
    | [RegexAndReplacement, RegexAndReplacement]
    | [RegexAndReplacement];
  if (isStartEnd(element.delimiters)) {
    regexAndReplacements = buildTwoRegexesFromMappingElement(
      element as ElementReplacementDelimitersSE
    );
  } else {
    // is string
    regexAndReplacements = buildOneRegexFromMappingElement(
      element as ElementReplacementDelimitersString
    );
  }
  log.debug("The regex and replacement pairs are:");
  log.debug(JSON.stringify(regexAndReplacements, null, 2));
  return regexAndReplacements;
}

function buildTwoRegexesFromMappingElement(
  element: ElementReplacementDelimitersSE
): [RegexAndReplacement, RegexAndReplacement] {
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
}

function buildOneRegexFromMappingElement(
  element: ElementReplacementDelimitersString
): [RegexAndReplacement] {
  let regexAndReplacements: RegexAndReplacement;
  if (isStartEnd(element.replacements)) {
    log.debug("Delimiters is a string and replacements is StartEnd.");
    regexAndReplacements = [
      buildRegexFromDelimiter(element.delimiters),
      buildReplacementsFromReplacementDelimiters(element.replacements),
    ];
  } else {
    // is string
    log.debug("Both delimiters and replacements are strings.");
    regexAndReplacements = [
      unescapedDelimiter(element.delimiters),
      element.replacements,
    ];
  }
  return [regexAndReplacements];
}
