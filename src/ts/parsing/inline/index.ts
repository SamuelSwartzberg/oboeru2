import { getRegexReplacementPairs } from "./regex-replacement";

export function formatInlineLevel(htmlBlob: string): string {
  console.time("formatInlineLevelRegex");

  for (const [regex, replacement] of getRegexReplacementPairs()) {
    console.log(`regex: ${regex}`);
    console.log(`replacement: ${replacement}`);
    htmlBlob = htmlBlob.replace(regex, replacement as string); // lie since ts can't deal with union types distributed over overloads
  }
  console.timeEnd("formatInlineLevelRegex");

  return htmlBlob;
}
