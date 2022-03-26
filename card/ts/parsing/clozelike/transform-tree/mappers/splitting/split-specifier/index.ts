import log from "loglevel";
import { TreeElement } from "../../../globals";
import { mapTreeElementIfClozelike } from "../../map-element";
import { WithHint } from "../../separate-hint";
import { separateIntoActionMappingsAndNonspecifier } from "./split";

type Specifier = {
  actionMappings?: string[];
};

export type WithSpecifier = WithHint & Specifier;

export function splitSpecifierTreeELement(
  treeElement: TreeElement<WithHint>
): TreeElement<WithSpecifier> {
  return mapTreeElementIfClozelike(treeElement, (treeElement) => {
    let actionMappings: string[];
    let nonspecifier: string;
    if (typeof treeElement.value === "string") {
      log.debug("treeElement.value is a string");
      [actionMappings, nonspecifier] =
        separateIntoActionMappingsAndNonspecifier(treeElement.value);
      treeElement.value = nonspecifier;
    } else {
      log.debug("treeElement.value is an array");
      [actionMappings, nonspecifier] =
        separateIntoActionMappingsAndNonspecifier(treeElement.value[0]);
      treeElement.value[0] = nonspecifier;
    }
    if (nonspecifier.includes(";"))
      log.warn(
        `Parsed nonspecifier ${nonspecifier} contained a ;, which may indicate that parsing failed (but may also be legitimate).`
      );
    log.debug(
      `Within splitSpecifierTreeELement, what we now have is actionMappings: ${
        actionMappings.length > 0 ? actionMappings : "[]"
      }; nonspecifier: ${nonspecifier}`
    );
    const newTreeElement: TreeElement<WithSpecifier> = {
      ...treeElement,
      contents: {
        ...treeElement.contents,
        actionMappings,
      },
    };
    return newTreeElement;
  });
}
