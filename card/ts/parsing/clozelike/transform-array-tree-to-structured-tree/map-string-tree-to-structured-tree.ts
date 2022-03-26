import { TreeElement } from "../3-tree-transformation/globals";
import { possiblyRecursiveTArray } from "../globals";

export type BooleanClozelike = {
  clozelike?: boolean;
};

export function mapStringTreeToStructuredTree(
  clozeLikeArrayTree: possiblyRecursiveTArray<string> | string,
  isToplevel: boolean
): TreeElement<BooleanClozelike> {
  if (Array.isArray(clozeLikeArrayTree) && clozeLikeArrayTree.length === 1) {
    return {
      value: clozeLikeArrayTree[0] as string,
      children: [],
      contents: { clozelike: true },
    };
  } else if (!Array.isArray(clozeLikeArrayTree)) {
    const elem = {
      value: clozeLikeArrayTree,
      children: [],
      contents: { clozelike: false },
    };
    return elem;
  } else {
    if (isToplevel) {
      return {
        value: "",
        children: clozeLikeArrayTree.map((elem) =>
          mapStringTreeToStructuredTree(elem, false)
        ),
        contents: { clozelike: false },
      };
    } else {
      let [firstElem, lastElem] = ["", ""];
      if (typeof clozeLikeArrayTree[0] === "string") {
        firstElem = clozeLikeArrayTree[0];
      } else
        throw new Error(
          "should not be possible for the first element of cloze tree to not be a string (because it contains the specifier)"
        );
      if (
        typeof clozeLikeArrayTree[clozeLikeArrayTree.length - 1] === "string" &&
        clozeLikeArrayTree.length > 1
      ) {
        lastElem = clozeLikeArrayTree.pop() as string;
      }
      let parsedElemWithChildren = {
        value: [firstElem, lastElem] as [string, string],
        children: clozeLikeArrayTree
          .slice(1)
          .map((elem) => mapStringTreeToStructuredTree(elem, false)),
        contents: { clozelike: true },
      };
      return parsedElemWithChildren;
    }
  }
}
