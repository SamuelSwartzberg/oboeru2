import { processCustomClozelikes } from "./parse-clozelike";
import { possiblyRecursiveStringArray } from "./parse-to-tree";

export function replaceClozeLikes(
  clozeLikeArrayTree: possiblyRecursiveStringArray,
  isTop: boolean
): string {
  if (Array.isArray(clozeLikeArrayTree) && clozeLikeArrayTree.length === 1) {
    return processCustomClozelikes(clozeLikeArrayTree[0] as string);
  } else if (!Array.isArray(clozeLikeArrayTree)) {
    return clozeLikeArrayTree;
  } else {
    if (isTop)
      return clozeLikeArrayTree
        .map((elem) =>
          replaceClozeLikes(elem as possiblyRecursiveStringArray, false)
        )
        .join("");
    else
      return processCustomClozelikes(
        clozeLikeArrayTree
          .map((elem) =>
            replaceClozeLikes(elem as possiblyRecursiveStringArray, false)
          )
          .join("")
      );
  }
}
