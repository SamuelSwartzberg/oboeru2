import { WithParsedActionMappings } from "../../../3-tree-transformation/mappers/parse-action-mapping-to-action-targets";
import { NarrowTreeElement } from "../../reduce-tree";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./hint";

export function getStringFromWithParsedActionMappingsTreeElement(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  if (treeElement.contents.clozelike) {
    return getHTMLFromClozelike(treeElement);
  } else {
    return treeElement.value;
  }
}

function getHTMLFromClozelike(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  if (!treeElement.contents.parsedActionMappings)
    throw new Error(
      `The clozelike with textcontent "${treeElement.value}" has no parsed action mappings, which is not allowed (and should be impossible, since it is coded to default to a cloze).`
    );
  const activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(
      treeElement.contents.parsedActionMappings
    ).join(" ");
  return clozelikeHTMLFromStringConstituents(
    treeElement.value,
    activityClasses,
    getHintStyleDeclarationIfAny(treeElement.contents.hint)
  );
}
