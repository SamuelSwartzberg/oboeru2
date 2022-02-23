import { setCurrentClozeIndex } from "./current-cloze-index";

export function handleAbsoluteINATP(
  specifier: string,
  isCloze: boolean
): number {
  let tryParseInt = parseInt(specifier, 10);
  if (isNaN(tryParseInt))
    throw new Error(`Invalid number specifier: ${specifier}`);
  if (isCloze) setCurrentClozeIndex(tryParseInt);
  return tryParseInt;
}
