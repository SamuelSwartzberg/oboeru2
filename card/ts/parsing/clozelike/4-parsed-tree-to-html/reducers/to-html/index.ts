import { TypeWithStringOrStringStringValueAndChildren } from "../../../2-tree-to-parsed-tree/map-tree";
import {
  Clozelike,
  isClozelike,
} from "../../../2-tree-to-parsed-tree/mappers/to-parsed-clozelike";
import { getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers } from "./action-mapping-to-classes";
import { clozelikeHTMLFromStringConstituents } from "./clozelike-html-from-string-components";
import { getHintStyleDeclarationIfAny } from "./hint";

export function getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike(
  valueAndChildrenAndPotentiallyClozelike:
    | TypeWithStringOrStringStringValueAndChildren
    | Clozelike,
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
