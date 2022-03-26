import log from "loglevel";
import { TreeElement } from "../../../globals";
import { splitActionMapping } from "../globals";
import { WithSpecifier } from "../split-specifier";

type SeparatedActionMappings = {
  separatedActionMappings?: {
    [k: string]: string;
  };
};

export type WithSplitActionMappings = WithSpecifier & SeparatedActionMappings;

export function splitActionMappingTreeElement(
  treeElement: TreeElement<WithSpecifier>
): TreeElement<WithSplitActionMappings> {
  log.debug(
    "splitActionMappingTreeElement was called to handle a tree element..."
  );
  if (treeElement.contents.clozelike && treeElement.contents.actionMappings) {
    log.debug("...and it was 🟩  a clozelike and had actionMappings");
    const separatedActionMappings = Object.fromEntries(
      treeElement.contents.actionMappings.map((actionMapping) =>
        splitActionMapping(actionMapping)
      )
    );
    const newTreeElement: TreeElement<WithSplitActionMappings> = {
      ...treeElement,
      contents: {
        ...treeElement.contents,
        separatedActionMappings,
      },
    };
    return newTreeElement;
  } else {
    log.debug("...but it was 🟨  not a clozelike or had no actionMappings");
    return { ...treeElement };
  }
}
