import { TypeWithStringOrStringStringValueAndChildren } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { Clozelike } from "../2-tree-to-structured-tree/mappers/to-parsed-clozelike";
import { reduceTree } from "./reduce-tree";
import { annnotateWithCountedNumber } from "./reducers/number-only";
import { getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike } from "./reducers/to-html";

export function reduceTreeToHTML(
  clozeLikeArrayTree: Clozelike | TypeWithStringOrStringStringValueAndChildren,
  isTop: boolean
): string {
  return reduceTree<Clozelike>(
    clozeLikeArrayTree,
    isTop,
    getStringFromTypeWithStringOrStringStringValueAndChildrenPotentiallyClozelike
  );
}

export function annotateClozesInStructureWithCountedNumber(
  clozeLikeArrayTree: Clozelike | TypeWithStringOrStringStringValueAndChildren,
  isTop: boolean
): string {
  throw new Error("not implemented");
  //   return reduceTree<Clozelike>(
  //     clozeLikeArrayTree,
  //     isTop,
  //     annnotateWithCountedNumber
  //   );
  //
}
