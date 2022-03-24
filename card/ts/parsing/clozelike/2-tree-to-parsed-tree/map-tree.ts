import { possiblyRecursiveTArray } from "../globals";

export type TypeWithStringOrStringStringValueAndChildren = {
  value: string | [string, string];
  children: TypeWithStringOrStringStringValueAndChildren[];
};

export type TypeWithStringOrStringStringValueAndChildrenCanAlsoBe<T> = {
  value: string | [string, string];
  children: (TypeWithStringOrStringStringValueAndChildren | T)[];
};

export type TypeWithStringOrStringStringValueAndChildrenAnd<T> = T &
  TypeWithStringOrStringStringValueAndChildrenCanAlsoBe<T>;

export function mapTree<
  T extends TypeWithStringOrStringStringValueAndChildrenCanAlsoBe<T>
>(
  clozeLikeArrayTree: possiblyRecursiveTArray<string> | string,
  isToplevel: boolean,
  mapFunc: (contents: string | [string, string]) => T
): T | TypeWithStringOrStringStringValueAndChildren {
  if (Array.isArray(clozeLikeArrayTree) && clozeLikeArrayTree.length === 1) {
    const parsedElem = mapFunc(clozeLikeArrayTree[0] as string);
    const parsedElemWithChildren = {
      ...parsedElem,
      children: [],
    };
    return parsedElemWithChildren;
  } else if (!Array.isArray(clozeLikeArrayTree)) {
    const elem: TypeWithStringOrStringStringValueAndChildren = {
      value: clozeLikeArrayTree,
      children: [],
    };
    return elem;
  } else {
    if (isToplevel) {
      return {
        value: "",
        children: clozeLikeArrayTree.map((elem) =>
          mapTree(elem, false, mapFunc)
        ),
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
        typeof clozeLikeArrayTree[clozeLikeArrayTree.length - 1] === "string"
      ) {
        lastElem = clozeLikeArrayTree.pop() as string;
      }
      let parsedElem = mapFunc([firstElem, lastElem]);
      let parsedElemWithChildren = {
        ...parsedElem,
        children: clozeLikeArrayTree
          .slice(1)
          .map((elem) => mapTree(elem, false, mapFunc)),
      };
      return parsedElemWithChildren;
    }
  }
}
