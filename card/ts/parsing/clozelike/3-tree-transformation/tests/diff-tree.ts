import { TreeElement } from "../globals";

export function isDifferentTree<T, U>(
  treeElement1: TreeElement<T>,
  treeElement2: TreeElement<U>
): boolean {
  return JSON.stringify(treeElement1) !== JSON.stringify(treeElement2);
}
