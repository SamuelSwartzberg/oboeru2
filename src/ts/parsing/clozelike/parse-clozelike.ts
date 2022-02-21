import { currentCardIndex } from "../../anki-card";
import { separateIntoSpecifiersAndNonspecifiers } from "../globals";

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

function parseSpecifierIntoKeyValue(specifier: string): [string, string] {
  let prefixLength = 0;
  if (specifier[0] === "u") prefixLength++;
  // starts with u, so at least 2 long
  if (specifier[prefixLength] === "h" && specifier[prefixLength + 1] === "r")
    prefixLength += 2;
  // hr/uhr are always one longer
  else if (["c", "s", "h"].some((item) => specifier[prefixLength] === item))
    prefixLength++;
  else throw new Error("Tried to parse non-specifier into specifier.");
  return [specifier.slice(0, prefixLength), specifier.slice(prefixLength)];
}

function splitSpecifierIntoConstituents(specifierValue: string): string[] {
  return specifierValue.split(",");
}

type groupIfAny = "a" | "b" | null;
type clozeLikeSpecifier = {
  cardsForWhichToApply: number[];
  all: boolean;
  group: groupIfAny;
  hint?: string;
};

function parseValuePartsToObject(
  specifierValueParts: string[],
  isCloze: boolean
): clozeLikeSpecifier {
  let specifierObject: clozeLikeSpecifier = {
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

function getKeyAndParsedSpecifierFromSpecifier(
  specifier: string
): [string, clozeLikeSpecifier] | undefined {
  try {
    let [specifierKey, specifierValue] = parseSpecifierIntoKeyValue(specifier);

    let isCloze = specifierKey === "c";
    let specifierValueParts = splitSpecifierIntoConstituents(specifierValue);
    let specifierValuesParsedToObject: clozeLikeSpecifier =
      parseValuePartsToObject(specifierValueParts, isCloze);
    return [specifierKey, specifierValuesParsedToObject];
  } catch (e) {
    return undefined;
  }
}

function tryAddHint(hint: string) {
  if (hint.length > 0) {
    return `style="--content-when-active: ${hint}"`;
  }
}

function getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(specifierMapping: {
  [k: string]: clozeLikeSpecifier;
}): string[] {
  return Object.entries(specifierMapping).map(([specifierType, specifier]) => {
    let classList: string[] = [];
    if (specifier.group) classList.push(`${specifierType}-${specifier.group}`);
    if (specifier.all) classList.push(`${specifierType}-active`);
    else if (specifier.cardsForWhichToApply.includes(currentCardIndex()))
      classList.push(`${specifierType}-active`);
    return classList.join(" ");
  });
}

export function processCustomClozelikes(contents: string): string {
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    getKeyAndParsedSpecifierFromSpecifier
  );

  if (Object.keys(specifiers).length === 0) return contents;
  let [clozelikeBody, ...possiblyHint] = nonspecifier.split("::");
  let hint: string = Array.isArray(possiblyHint) ? possiblyHint.join("::") : "";
  let activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(specifiers);
  return `<span class="is-cloze-scramble-or-hide ${activityClasses.join(
    " "
  )}" ${
    activityClasses.includes("c-active") ? tryAddHint(hint) : ""
  }>${clozelikeBody}</span>`;
}
