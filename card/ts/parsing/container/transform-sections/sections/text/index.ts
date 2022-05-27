import log from "loglevel";
import { parseTextSection } from "./parse";
import { stringifySection } from "./stringify";
import { transformTextSection } from "./transform";
import { Section } from "./types";

export function parseAsTextSection(rawHTMLText: string): string {
  log.debug("Transforming HTML string to parsed text section...");
  log.debug("The raw HTML string is:");
  log.debug(rawHTMLText);
  const parsedTextSection = parseTextSection(rawHTMLText);
  log.debug("Parsed text section:");
  log.debug(parsedTextSection);
  testParsedTextSection(parsedTextSection);
  log.debug("Transforming parsed text section...");
  const transformedTextSection = transformTextSection(parsedTextSection);
  log.debug("Transformed text section:");
  log.debug(transformedTextSection);
  const finalString = stringifySection(transformedTextSection);
  log.debug("Final string:");
  log.debug(finalString);
  return finalString;
}

function testParsedTextSection(parsedTextSection: Section<string>) {
  if (parsedTextSection.subsections.length === 0) {
    throw new Error(
      `Section should have at least one subsection, but has none.`
    );
  } else {
    parsedTextSection.subsections.forEach((subsection) => {
      if (!subsection.lines || subsection.lines.length === 0) {
        throw new Error(
          `Subsection should have at least one line, but has none.`
        );
      }
    });
  }
}
