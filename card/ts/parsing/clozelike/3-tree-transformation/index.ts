import log from "loglevel";
import { BooleanClozelike } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "./globals";
import { mapTree } from "./map-tree";
import {
  parseActionMappingTreeElement,
  WithParsedActionMappings,
} from "./mappers/parse-action-mapping-to-action-targets";
import { separateHintTreeElement, WithHint } from "./mappers/separate-hint";
import {
  splitActionMappingTreeElement,
  WithSplitActionMappings,
} from "./mappers/splitting/split-action-mapping";
import {
  splitSpecifierTreeELement,
  WithSpecifier,
} from "./mappers/splitting/split-specifier";
import { isDifferentTree } from "./tests/diff-tree";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<WithParsedActionMappings> {
  const hintSeparatedTree = mapAndTestTree<BooleanClozelike, WithHint>(
    structuredTree,
    "separateHintTreeElement",
    separateHintTreeElement,
    true
  );

  const splitSpeciferTree = mapAndTestTree<WithHint, WithSpecifier>(
    hintSeparatedTree,
    "splitSpecifierTreeELement",
    splitSpecifierTreeELement
  );
  const splitActionMappingTree = mapAndTestTree<
    WithSpecifier,
    WithSplitActionMappings
  >(
    splitSpeciferTree,
    "splitActionMappingTreeElement",
    splitActionMappingTreeElement
  );
  const parsedActionMappingTree = mapAndTestTree<
    WithSplitActionMappings,
    WithParsedActionMappings
  >(
    splitActionMappingTree,
    "parseActionMappingTreeElement",
    parseActionMappingTreeElement
  );
  return parsedActionMappingTree;
}
splitSpecifierTreeELement;

function mapAndTestTree<T, U>(
  treeElement: TreeElement<T>,
  name: string,
  transformationCallback: (treeElement: TreeElement<T>) => TreeElement<U>,
  dontErrorOnlyWarnIfTreesHaveSameContent: boolean = false
): TreeElement<U> {
  log.debug(`Transforming tree with ${name}().`);
  const newTreeElement = mapTree<T, U>(
    treeElement,
    true,
    transformationCallback
  );
  log.debug("The new tree is:");
  log.debug(newTreeElement);
  if (treeElement === (newTreeElement as unknown as TreeElement<T>))
    throw new Error(
      "The new tree is the same object as the old tree, which should be impossible."
    );
  if (!dontErrorOnlyWarnIfTreesHaveSameContent) {
    if (!isDifferentTree(treeElement, newTreeElement))
      throw new Error("The old tree and the new tree are the same in content.");
  } else log.warn("The old tree and the new tree are the same in content.");

  return newTreeElement;
}
