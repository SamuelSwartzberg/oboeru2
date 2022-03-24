import { setCurrentClozeIndex } from "./current-cloze-index";

export function handleAbsoluteINATP(
  absoluteINATPstring: string,
  isCloze: boolean
): number {
  let tryParseAbsoluteINATP = parseInt(absoluteINATPstring, 10);
  if (isNaN(tryParseAbsoluteINATP))
    throw new Error(`Invalid number specifier: ${absoluteINATPstring}`);
  if (isCloze) setCurrentClozeIndex(tryParseAbsoluteINATP);
  return tryParseAbsoluteINATP;
}
