import { TreeElement } from "./globals";

export function mapTree<T, U>(
  treeElement: TreeElement<T>,
  isTopLevel: boolean,
  mapFunction: (element: TreeElement<T>) => TreeElement<U>
): TreeElement<U> {
  const newChildren = treeElement.children.map((child) =>
    mapTree(child, false, mapFunction)
  );
  const newElement = mapFunction(treeElement);
  newElement.children = newChildren;
  return newElement;
}
