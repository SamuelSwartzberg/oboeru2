import { TreeElement } from "../../../globals";
import { splitActionMapping } from "../globals";
import { WithSpecifier } from "../split-specifier";

type SeparatedActionMappings = {
  separatedActionMappings?: {
    [k: string]: string;
  };
};

export type WithSeparatedActionMappings = WithSpecifier &
  SeparatedActionMappings;

export function splitSpecifier(
  treeElement: TreeElement<WithSpecifier>
): TreeElement<WithSeparatedActionMappings> {
  if (treeElement.contents.clozelike && treeElement.contents.actionMappings) {
    const separatedActionMappings = Object.fromEntries(
      treeElement.contents.actionMappings.map((actionMapping) =>
        splitActionMapping(actionMapping)
      )
    );
    const newTreeElement: TreeElement<WithSeparatedActionMappings> = {
      ...treeElement,
      contents: {
        ...treeElement.contents,
        separatedActionMappings,
      },
    };
    return newTreeElement;
  } else return treeElement as TreeElement<WithSeparatedActionMappings>;
}
