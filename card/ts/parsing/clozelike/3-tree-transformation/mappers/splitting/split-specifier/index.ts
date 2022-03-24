import { TreeElement } from "../../../globals";
import { WithHint } from "../../separate-hint";
import { separateIntoActionMappingsAndNonspecifier } from "./split";

type Specifier = {
  actionMappings?: string[];
};

export type WithSpecifier = WithHint & Specifier;

export function splitSpecifier(
  treeElement: TreeElement<WithHint>
): TreeElement<WithSpecifier> {
  if (treeElement.contents.clozelike) {
    let actionMappings: string[];
    let nonspecifier: string;
    if (typeof treeElement.value === "string") {
      [actionMappings, nonspecifier] =
        separateIntoActionMappingsAndNonspecifier(treeElement.value);
      treeElement.value = nonspecifier;
    } else {
      [actionMappings, nonspecifier] =
        separateIntoActionMappingsAndNonspecifier(treeElement.value[1]);
      treeElement.value[1] = nonspecifier;
    }
    const newTreeElement: TreeElement<WithSpecifier> = {
      ...treeElement,
      contents: {
        ...treeElement.contents,
        actionMappings,
      },
    };
    return newTreeElement;
  } else return treeElement as TreeElement<WithSpecifier>;
}
