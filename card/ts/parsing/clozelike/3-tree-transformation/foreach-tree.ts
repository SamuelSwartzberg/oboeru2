import { TreeElement } from "./globals";

export function foreachTree<T>(
  treeElement: TreeElement<T>,
  foreachFunction: (element: TreeElement<T>) => void
) {
  foreachFunction(treeElement);
  treeElement.children.forEach((child) => {
    foreachTree(child, foreachFunction);
  });
}
