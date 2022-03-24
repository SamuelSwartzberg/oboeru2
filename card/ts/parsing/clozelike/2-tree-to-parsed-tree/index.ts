import log from "loglevel";
import { separateIntoSpecifiersAndNonspecifiers } from "../../globals";
import {
  getActionNameAndActionTargetsFromActionMappingString,
  getActionNameAndResolvedActionTargetNumbersFromActionMappingString,
} from "./action-mappings";
import { splitIntoContentAndHint } from "./hint";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./structs-to-html/action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./structs-to-html/clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./structs-to-html/hint";

export function processCustomClozelikesToString(contents: string): string {
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    getActionNameAndActionTargetsFromActionMappingString,
    "c+"
  );
  log.debug(
    `The clozelike with textcontent "${contents}" has specifiers: ${JSON.stringify(
      specifiers
    )}`
  );
  if (Object.keys(specifiers).length === 0)
    throw new Error(
      `The clozelike with textcontent "${contents}" has no specifiers, which is not allowed (and should be impossible, since it is coded to default to a cloze).`
    );
  let contentAndHint = splitIntoContentAndHint(nonspecifier);
  let activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(
      specifiers
    ).join(" ");
  return clozelikeHTMLFromStringConstituents(
    contentAndHint.content,
    activityClasses,
    getHintStyleDeclarationIfAny(contentAndHint.hint)
  );
}

export function annnotateWithCountedNumber(contents: string): string {
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    getActionNameAndResolvedActionTargetNumbersFromActionMappingString,
    "c+"
  );

  const specifierRestringified = Object.entries(specifiers)
    .map(([specifier, specifierValue]) => {
      const specifierValueString = specifierValue.join(",");
      return `${specifier}${specifierValueString}`;
    })
    .join(";");

  return `⟮${specifierRestringified};${nonspecifier}⟯`;
}
