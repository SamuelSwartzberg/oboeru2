import { TreeElement } from "./globals";

export function mapTree<T, U>(
  treeElement: TreeElement<T>,
  isTopLevel: boolean,
  mapFunction: (element: TreeElement<T>) => U
): TreeElement<U> {
  const newChildren = treeElement.children.map((child) =>
    mapTree(child, false, mapFunction)
  );
  const newContents = mapFunction(treeElement);
  const newElement = {
    value: treeElement.value,
    children: newChildren,
    contents: newContents,
  };
  return newElement;
}
