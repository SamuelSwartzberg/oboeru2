import {
  getCurrentClozeIndex,
  setCurrentClozeIndex,
} from "./current-cloze-index";

var INCREMENT_SYNTAX_CHARACTERS: readonly string[] = ["+", "-", "_"];

export function getIncrementSyntaxCharacters(): readonly string[] {
  return INCREMENT_SYNTAX_CHARACTERS;
}

export function handleIncrementINATP(
  specifier: string,
  isCloze: boolean
): number {
  let viewModeOnly: boolean = false;
  if (specifier.length > 1 && specifier.startsWith("_")) {
    viewModeOnly = true;
    specifier = specifier.slice(1);
  }
  let [incrementOperator, incrementRest] = [
    specifier.slice(0, 1),
    specifier.slice(1),
  ];
  if (!INCREMENT_SYNTAX_CHARACTERS.includes(incrementOperator))
    throw new Error(
      `Increment specifier is not starting with an increment operator. This error should only be able to occur if viewModeOnly is true, as we've filtered other non-valid operator already.`
    );
  let increment = NaN;
  if (incrementRest.length === 0) increment = 1;
  else {
    let tryParseInt = parseInt(incrementRest, 10);
    if (isNaN(tryParseInt))
      throw new Error(`Invalid increment amount: ${incrementRest}`);
    increment = tryParseInt;
  }
  let newValue = getCurrentClozeIndex();
  if (incrementOperator === "+") newValue += increment;
  else if (incrementOperator === "-") newValue -= increment;
  // else if (incrementOperator === "_") newValue = newValue;, but there's no need to actually execute this
  if (isCloze && !viewModeOnly) setCurrentClozeIndex(newValue);
  return newValue;
}
