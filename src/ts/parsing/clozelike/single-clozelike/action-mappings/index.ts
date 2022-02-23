import { splitActionMappingStringIntoNameAndTargetsString } from "./split-action-mapping-string";

var currentClozeIndex = 1;

function handleNumberNumberSpecifier(
  specifier: string,
  isCloze: boolean
): number {
  let tryParseInt = parseInt(specifier, 10);
  if (isNaN(tryParseInt))
    throw new Error(`Invalid number specifier: ${specifier}`);
  if (isCloze) currentClozeIndex = tryParseInt;
  return tryParseInt;
}

var incrementSyntaxCharacters: readonly string[] = ["+", "-", "_"];

function handleIncrementNumberSpecifier(
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
  if (!incrementSyntaxCharacters.includes(incrementOperator))
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
  let newValue = currentClozeIndex;
  if (incrementOperator === "+") newValue += increment;
  else if (incrementOperator === "-") newValue -= increment;
  // else if (incrementOperator === "_") newValue = newValue;, but there's no need to actually execute this
  if (isCloze && !viewModeOnly) currentClozeIndex = newValue;
  return newValue;
}

function handleIndividualNumberSpecifier(
  specifier: string,
  isCloze: boolean
): number {
  if (incrementSyntaxCharacters.some((item) => specifier.startsWith(item)))
    return handleIncrementNumberSpecifier(specifier, isCloze);
  else return handleNumberNumberSpecifier(specifier, isCloze);
}

function handleRangeSpecifier(specifier: string, isCloze: boolean): number[] {
  var specifierStartEnd = specifier.split(":");
  var specifierStartEndInt = specifierStartEnd.map((specpart) =>
    handleIndividualNumberSpecifier(specpart, isCloze)
  );
  return Array.from(
    Array(specifierStartEndInt[1] - specifierStartEndInt[0] + 1).keys()
  ).map((i) => specifierStartEndInt[0] + i);
}

function extractNumbersThatThingAppliesTo(
  part: string,
  isCloze: boolean
): number[] {
  if (part.includes(":")) return handleRangeSpecifier(part, isCloze);
  else return [handleIndividualNumberSpecifier(part, isCloze)];
}

function splitActionTargetStringIntoActionTargets(
  specifierValue: string
): string[] {
  return specifierValue.split(",");
}

type groupIfAny = "a" | "b" | null;
export type ActionTargetsObject = {
  cardsForWhichToApply: number[];
  all: boolean;
  group: groupIfAny;
  hint?: string;
};

function actionTargetsToObject(
  specifierValueParts: string[],
  isCloze: boolean
): ActionTargetsObject {
  let specifierObject: ActionTargetsObject = {
    cardsForWhichToApply: [],
    all: false,
    group: null,
  };

  for (const part of specifierValueParts) {
    if (part === "a" || part === "b") specifierObject.group = part;
    else if (part === "∞") specifierObject.all = true;
    else {
      specifierObject.cardsForWhichToApply.push(
        ...extractNumbersThatThingAppliesTo(part, isCloze)
      );
    }
    // else do nothing
  }
  return specifierObject;
}

export function getActionNameAndActionTargetsFromActionMappingString(
  actionMappingString: string
): [string, ActionTargetsObject] | undefined {
  try {
    let [actionName, actionTargetsString] =
      splitActionMappingStringIntoNameAndTargetsString(actionMappingString);

    let isCloze = actionName === "c";
    let actionTargets =
      splitActionTargetStringIntoActionTargets(actionTargetsString);
    let actionTargetsAsObject: ActionTargetsObject = actionTargetsToObject(
      actionTargets,
      isCloze
    );
    return [actionName, actionTargetsAsObject];
  } catch (e) {
    return undefined;
  }
}
