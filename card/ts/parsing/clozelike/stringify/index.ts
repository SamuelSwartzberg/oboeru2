import log from "loglevel";
import { TreeElement } from "../3-tree-transformation/globals";
import { WithParsedActionMappings } from "../3-tree-transformation/mappers/parse-action-mapping-to-action-targets";
import { reduceTreeToString } from "./reduce-tree-string";
import { getStringFromWithParsedActionMappingsTreeElement } from "./reducers/to-html";

export function reduceTreeToCardHTML(
  clozeLikeArrayTree: TreeElement<WithParsedActionMappings>,
  isTop: boolean
): string {
  log.debug("Reducing tree to card HTML.");
  const reducedTree = reduceTreeToString<WithParsedActionMappings>(
    clozeLikeArrayTree,
    isTop,
    getStringFromWithParsedActionMappingsTreeElement
  );
  const REDUCED_TREE_LENGTH_SANITY_MINIMUM = 50;
  if (reducedTree.length < REDUCED_TREE_LENGTH_SANITY_MINIMUM)
    throw new Error(
      `Reduced tree to card HTML was too short. It was ${reducedTree.length} characters long, but the minimum allowed is ${REDUCED_TREE_LENGTH_SANITY_MINIMUM}.`
    );
  return reducedTree;
}
