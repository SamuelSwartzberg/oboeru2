import { getRegexReplacementPairs } from "./regex-replacement/simple";

export function formatInlineLevel(htmlBlob: string): string {
  console.time("formatInlineLevelRegex");

  for (const [regex, replacement] of getRegexReplacementPairs()) {
    htmlBlob = htmlBlob.replace(regex, replacement as string); // lie since ts can't deal with union types distributed over overloads
  }
  console.timeEnd("formatInlineLevelRegex");

  return htmlBlob;
}
