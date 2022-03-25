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
  if (treeElement.contents.clozelike && treeElement.contents.actionMappings) {
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
  } else return treeElement as TreeElement<WithSplitActionMappings>;
}
