import { TreeElement } from "../3-tree-transformation/globals";
import { WithParsedActionMappings } from "../3-tree-transformation/mappers/parse-action-mapping-to-action-targets";
import { reduceTree } from "./reduce-tree";
import { getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike } from "./reducers/to-html";

export function reduceTreeToHTML(
  clozeLikeArrayTree: TreeElement<WithParsedActionMappings>,
  isTop: boolean
): string {
  return reduceTree<With>(
    clozeLikeArrayTree,
    isTop,
    getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike
  );
}
