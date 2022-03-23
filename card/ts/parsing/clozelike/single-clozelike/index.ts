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
  // let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
  //   contents,
  //   getActionNameAndActionTargetsFromActionMappingString,
  //   "c+"
  // );

  // if (Object.keys(specifiers).length === 0) return contents;
  // let contentAndHint = splitIntoContentAndHint(nonspecifier);
  // let activityClasses =
  //   getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(
  //     specifiers
  //   ).join(" ");
  // return clozelikeHTMLFromStringConstituents(
  //   contentAndHint.content,
  //   activityClasses,
  //   getHintStyleDeclarationIfAny(contentAndHint.hint)
  // );
  return "";
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