import log from "loglevel";
import { getRegexReplacementPairs } from "./regex-replacement";

export function formatInlineLevel(htmlBlob: string): string {
  log.debug(
    "Formatting inline level (markdown-like stuff, and alternative escapes)"
  );
  for (const [regex, replacement] of getRegexReplacementPairs()) {
    htmlBlob = htmlBlob.replace(regex, replacement as string); // lie since ts can't deal with union types distributed over overloads
  }
  return htmlBlob;
}
