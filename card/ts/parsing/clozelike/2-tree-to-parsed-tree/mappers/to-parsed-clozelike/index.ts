import log from "loglevel";
import { separateIntoSpecifiersAndNonspecifiers } from "../../../../globals";
import { TypeWithStringOrStringStringValueAndChildren } from "../../map-tree";
import {
  ActionTargetsObject,
  getActionNameAndActionTargetsFromActionMappingString,
  getActionNameAndResolvedActionTargetNumbersFromActionMappingString,
} from "./action-mappings";
import { splitIntoContentAndHint } from "./hint";

type Specifiers = { [specifier: string]: ActionTargetsObject };

export type Clozelike = {
  specifiers: Specifiers;
  hint?: string;
  value: string | [string, string];
  children: (Clozelike | TypeWithStringOrStringStringValueAndChildren)[];
};

export function isClozelike(
  valueAndChildrenAndPotentiallyClozelike:
    | Clozelike
    | TypeWithStringOrStringStringValueAndChildren
): valueAndChildrenAndPotentiallyClozelike is Clozelike {
  return (
    valueAndChildrenAndPotentiallyClozelike.hasOwnProperty("specifiers") &&
    valueAndChildrenAndPotentiallyClozelike.hasOwnProperty("hint")
  );
}

export function processStringToClozelike(
  contents: string | [string, string]
): Clozelike {
  let firstHalf;
  let secondHalf;
  let SEPARATOR;
  if (typeof contents === "string") {
    firstHalf = contents;
    secondHalf = "";
    SEPARATOR = "";
  } else {
    firstHalf = contents[0];
    secondHalf = contents[1];
    SEPARATOR = "689f2e5c-ab97-11ec-8a80-e3215b694c8a"; // generated UUID for unique separator
  }
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    firstHalf,
    getActionNameAndActionTargetsFromActionMappingString,
    "c+"
  );
  const rest = nonspecifier + SEPARATOR + secondHalf;
  log.debug(
    `The clozelike with textcontent "${contents}" has specifiers: ${JSON.stringify(
      specifiers
    )}`
  );
  if (Object.keys(specifiers).length === 0)
    throw new Error(
      `The clozelike with textcontent "${contents}" has no specifiers, which is not allowed (and should be impossible, since it is coded to default to a cloze).`
    );
  let contentAndHint = splitIntoContentAndHint(rest);
  let value: string | [string, string] = contentAndHint.content;
  if (SEPARATOR !== "") {
    value = value.split(SEPARATOR) as [string, string];
  }
  return {
    value: value,
    specifiers: specifiers,
    hint: contentAndHint.hint,
    children: [] as (
      | Clozelike
      | TypeWithStringOrStringStringValueAndChildren
    )[],
  };
}
