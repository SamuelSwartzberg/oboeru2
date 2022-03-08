import { separateIntoSpecifiersAndNonspecifiers } from "../../globals";
import { getActionNameAndActionTargetsFromActionMappingString } from "./action-mappings";
import { splitIntoContentAndHint } from "./hint";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./structs-to-html/action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./structs-to-html/clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./structs-to-html/hint";

export function processCustomClozelikes(contents: string): string {
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    getActionNameAndActionTargetsFromActionMappingString,
    "c+"
  );

  if (Object.keys(specifiers).length === 0) return contents;
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
