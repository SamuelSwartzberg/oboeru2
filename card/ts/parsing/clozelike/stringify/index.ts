import log from "loglevel";
import { TreeElement } from "../transform-tree/globals";
import { WithParsedActionMappings } from "../transform-tree/mappers/parse-action-mapping-to-action-targets";
import { NarrowTreeElement, reduceTreeToString } from "./reduce-tree-string";
import { getReducedClozelikeStringFromWithParsedActionMappingsTreeElement } from "./reducers/reencoded-clozelike-with-resolved-numbers";
import { getHTMLStringFromWithParsedActionMappingsTreeElement } from "./reducers/to-html";

export function reduceTreeToCardHTML(
  clozeLikeArrayTree: TreeElement<WithParsedActionMappings>,
  isTop: boolean
): string {
  return reduceTreeToSomeString(
    clozeLikeArrayTree,
    isTop,
    getHTMLStringFromWithParsedActionMappingsTreeElement
  );
}

export function reduceTreeToReencodedClozelikesWithResolvedNumbers(
  clozeLikeArrayTree: TreeElement<WithParsedActionMappings>,
  isTop: boolean
): string {
  return reduceTreeToSomeString(
    clozeLikeArrayTree,
    isTop,
    getReducedClozelikeStringFromWithParsedActionMappingsTreeElement
  );
}

export function reduceTreeToSomeString(
  clozeLikeArrayTree: TreeElement<WithParsedActionMappings>,
  isTop: boolean,
  callback: (
    clozeLikeArrayTree: NarrowTreeElement<WithParsedActionMappings>
  ) => string
): string {
  const reducedTree = reduceTreeToString<WithParsedActionMappings>(
    clozeLikeArrayTree,
    isTop,
    callback
  );
  const REDUCED_TREE_LENGTH_SANITY_MINIMUM = 50;
  if (reducedTree.length < REDUCED_TREE_LENGTH_SANITY_MINIMUM)
    throw new Error(
      `Reduced tree to card HTML was too short. It was ${reducedTree.length} characters long, but the minimum allowed is ${REDUCED_TREE_LENGTH_SANITY_MINIMUM}.`
    );
  return reducedTree;
}
