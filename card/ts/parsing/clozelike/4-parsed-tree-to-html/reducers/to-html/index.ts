import { TreeElement } from "../../../3-tree-transformation/globals";
import { WithParsedActionMappings } from "../../../3-tree-transformation/mappers/parse-action-mapping-to-action-targets";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./hint";

export function getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike(
  treeElement: TreeElement<WithParsedActionMappings>
  stringContentsWithStringifiedChildren: string
): string {
  if (isClozelike(valueAndChildrenAndPotentiallyClozelike)) {
    return getHTMLFromClozelike(
      valueAndChildrenAndPotentiallyClozelike,
      stringContentsWithStringifiedChildren
    );
  } else {
    let value;
    if (Array.isArray(valueAndChildrenAndPotentiallyClozelike.value)) {
      value = valueAndChildrenAndPotentiallyClozelike.value.join("");
    } else value = valueAndChildrenAndPotentiallyClozelike.value;
    return value;
  }
}

function getHTMLFromClozelike(
  clozelike: Clozelike,
  stringContentsWithStringifiedChildren: string
): string {
  const activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(
      clozelike.specifiers
    ).join(" ");
  return clozelikeHTMLFromStringConstituents(
    stringContentsWithStringifiedChildren,
    activityClasses,
    getHintStyleDeclarationIfAny(clozelike.hint)
  );
}
