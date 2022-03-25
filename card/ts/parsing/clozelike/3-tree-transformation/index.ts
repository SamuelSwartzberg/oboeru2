import log from "loglevel";
import { BooleanClozelike } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "./globals";
import { mapTree } from "./map-tree";
import {
  parseActionMapping,
  WithParsedActionMappings,
} from "./mappers/parse-action-mapping-to-action-targets";
import { separateHint, WithHint } from "./mappers/separate-hint";
import {
  splitActionMappingTreeElement,
  WithSplitActionMappings,
} from "./mappers/splitting/split-action-mapping";
import {
  splitSpecifier,
  WithSpecifier,
} from "./mappers/splitting/split-specifier";
import { isDifferentTree } from "./tests/diff-tree";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<WithParsedActionMappings> {
  const hintSeparatedTree = mapTree<BooleanClozelike, WithHint>(
    structuredTree,
    true,
    separateHint
  );
  log.debug(hintSeparatedTree);

  const splitSpeciferTree = mapAndTestTree<WithHint, WithSpecifier>(
    hintSeparatedTree,
    splitSpecifier
  );
  const splitActionMappingTree = mapAndTestTree<
    WithSpecifier,
    WithSplitActionMappings
  >(splitSpeciferTree, splitActionMappingTreeElement);
  const parsedActionMappingTree = mapAndTestTree<
    WithSplitActionMappings,
    WithParsedActionMappings
  >(splitActionMappingTree, parseActionMapping);
  return parsedActionMappingTree;
}
splitSpecifier;

function mapAndTestTree<T, U>(
  treeElement: TreeElement<T>,
  transformationCallback: (treeElement: TreeElement<T>) => TreeElement<U>
): TreeElement<U> {
  log.debug(`Transforming tree with ${transformationCallback.name}().`);
  const newTreeElement = mapTree<T, U>(
    treeElement,
    true,
    transformationCallback
  );
  log.debug("The new tree is:");
  log.debug(newTreeElement);
  if (!isDifferentTree(treeElement, newTreeElement))
    throw new Error("The old tree and the new tree are the same.");
  return newTreeElement;
}
