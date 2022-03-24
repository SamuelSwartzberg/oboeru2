
import { annnotateWithCountedNumber } from "./reducers/number-only";
import { getHTMLFromClozelike } from "./reducers/to-html";
import { possiblyRecursiveTArray<string> } from "../1-string-to-tree";

export function reduceTreeToHTML(
  clozeLikeArrayTree: possiblyRecursiveTArray<string>,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, getHTMLFromClozelike);
}

export function annotateClozesInStructureWithCountedNumber(
  clozeLikeArrayTree: possiblyRecursiveTArray<string>,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, annnotateWithCountedNumber);
}



