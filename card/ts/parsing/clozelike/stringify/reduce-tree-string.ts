import { TreeElement } from "../transform-tree/globals";

export type NarrowTreeElement<T> = TreeElement<T> & {
  value: string;
};

export function reduceTreeToString<T>(
  treeElement: TreeElement<T>,
  isTop: boolean,
  reducerFunc: (treeElement: NarrowTreeElement<T>) => string
): string {
  if (treeElement.children.length === 0) {
    let value: string;
    if (Array.isArray(treeElement.value)) {
      value = treeElement.value.join("");
    } else {
      value = treeElement.value;
    }
    return reducerFunc({
      ...treeElement,
      value,
    });
  } else {
    if (isTop) {
      return treeElement.children
        .map((child) => reduceTreeToString(child, false, reducerFunc))
        .join("");
    } else {
      const reducedChildren = treeElement.children.map((child) =>
        reduceTreeToString(child, false, reducerFunc)
      );
      if (Array.isArray(treeElement.value)) {
        const value =
          treeElement.value[0] +
          reducedChildren.join("") +
          treeElement.value[1];
        return reducerFunc({
          ...treeElement,
          value,
        });
      } else {
        throw new Error(
          "should not be possible for the value to not be an array"
        );
      }
    }
  }
}
