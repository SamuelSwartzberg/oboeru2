import { TreeElement } from "./globals";

export function flattenTree<T>(treeElement: TreeElement<T>): TreeElement<T>[] {
  const newChildren = treeElement.children.flatMap((child) =>
    flattenTree(child)
  );
  treeElement.children = [];
  const selfAndChildArray = [treeElement, ...newChildren];
  return selfAndChildArray;
}
