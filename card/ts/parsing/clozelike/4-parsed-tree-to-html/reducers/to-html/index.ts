import log from "loglevel";
import { WithParsedActionMappings } from "../../../3-tree-transformation/mappers/parse-action-mapping-to-action-targets";
import { NarrowTreeElement } from "../../reduce-tree-string";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./hint";

export function getStringFromWithParsedActionMappingsTreeElement(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  log.debug(
    "Getting card HMTL string for tree element with parsed action mappings..."
  );
  if (treeElement.contents.clozelike) {
    log.debug("...and it was 🟩  a clozelike");
    return getHTMLFromClozelike(treeElement);
  } else {
    log.debug("...and it was 🟨  not a clozelike ");
    return treeElement.value;
  }
}

function getHTMLFromClozelike(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  log.debug(
    "Getting HTML from clozelike represented by " + JSON.stringify(treeElement)
  );
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
