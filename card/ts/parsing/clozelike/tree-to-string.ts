import {
  annnotateWithCountedNumber,
  processCustomClozelikesToString,
} from "./single-clozelike";
import { possiblyRecursiveStringArray } from "./parse-to-tree";

export function replaceClozeLikes(
  clozeLikeArrayTree: possiblyRecursiveStringArray,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, processCustomClozelikesToString);
}

export function annotateClozesInStructureWithCountedNumber(
  clozeLikeArrayTree: possiblyRecursiveStringArray,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, annnotateWithCountedNumber);
}

function reduceTree(
  clozeLikeArrayTree: possiblyRecursiveStringArray,
  isTop: boolean,
  reducerFunc: (contents: string) => string
): string {
  if (Array.isArray(clozeLikeArrayTree) && clozeLikeArrayTree.length === 1) {
    return reducerFunc(clozeLikeArrayTree[0] as string);
  } else if (!Array.isArray(clozeLikeArrayTree)) {
    return clozeLikeArrayTree;
  } else {
    if (isTop)
      return clozeLikeArrayTree
        .map((elem) =>
          reduceTree(elem as possiblyRecursiveStringArray, false, reducerFunc)
        )
        .join("");
    else
      return reducerFunc(
        clozeLikeArrayTree
          .map((elem) =>
            reduceTree(elem as possiblyRecursiveStringArray, false, reducerFunc)
          )
          .join("")
      );
  }
}
