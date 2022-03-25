import log from "loglevel";
import { TreeElement } from "../../../globals";
import { WithHint } from "../../separate-hint";
import { separateIntoActionMappingsAndNonspecifier } from "./split";

type Specifier = {
  actionMappings?: string[];
};

export type WithSpecifier = WithHint & Specifier;

export function splitSpecifierTreeELement(
  treeElement: TreeElement<WithHint>
): TreeElement<WithSpecifier> {
  log.debug("splitSpecifierTreeELement was called to handle a tree element...");
  if (treeElement.contents.clozelike) {
    log.debug("...and it was a 🟩  clozelike");
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
        separateIntoActionMappingsAndNonspecifier(treeElement.value[1]);
      treeElement.value[1] = nonspecifier;
    }
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
  } else {
    log.debug("...but it was not a 🟨  clozelike");
    return { ...treeElement };
  }
}
