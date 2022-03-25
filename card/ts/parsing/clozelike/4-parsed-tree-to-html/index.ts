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
  return reducedTree;
}
