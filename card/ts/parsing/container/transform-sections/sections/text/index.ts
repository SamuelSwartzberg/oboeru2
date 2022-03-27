import { parseTextSection } from "./parse";
import { stringifySection } from "./stringify";
import { transformTextSection } from "./transform";

export function parseAsTextSection(
  rawHTMLText: string,
  isGroupShow: boolean
): string {
  const parsedTextSection = parseTextSection(rawHTMLText);
  const transformedTextSection = transformTextSection(parsedTextSection);
  const finalString = stringifySection(transformedTextSection, isGroupShow);
  return finalString;
}
