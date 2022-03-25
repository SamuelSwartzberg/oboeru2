import { TreeElement } from "./globals";

export function flattenTree<T>(treeElement: TreeElement<T>): TreeElement<T>[] {
  const newTreeElement = { ...treeElement };
  const newChildren = newTreeElement.children.flatMap((child) =>
    flattenTree(child)
  );
  newTreeElement.children = [];
  const selfAndChildArray = [newTreeElement, ...newChildren];
  return selfAndChildArray;
}
