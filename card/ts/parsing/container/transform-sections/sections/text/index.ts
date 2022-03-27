import { parseTextSection } from "./parse";
import { stringifySection } from "./stringify";
import { transformTextSection } from "./transform";
import { Section } from "./types";

export function parseAsTextSection(
  rawHTMLText: string,
  isGroupShow: boolean
): string {
  const parsedTextSection = parseTextSection(rawHTMLText);
  testParsedTextSection(parsedTextSection);
  const transformedTextSection = transformTextSection(parsedTextSection);
  const finalString = stringifySection(transformedTextSection, isGroupShow);
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
