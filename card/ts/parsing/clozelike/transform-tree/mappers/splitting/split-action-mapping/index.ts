import log from "loglevel";
import { TreeElement } from "../../../globals";
import { mapTreeElementIfClozelike } from "../../map-element";
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
  return mapTreeElementIfClozelike(treeElement, (treeElement) => {
    if (!treeElement.contents.actionMappings)
      throw new Error("no actionMappings");
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
  });
}
