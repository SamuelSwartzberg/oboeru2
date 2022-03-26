import log from "loglevel";
import { BooleanClozelike } from "../../transform-array-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "../globals";

export function mapTreeElementIfClozelike<
  T extends BooleanClozelike,
  U extends T
>(
  treeElement: TreeElement<T>,
  mapper: (treeElement: TreeElement<T>) => TreeElement<U>
): TreeElement<U> {
  log.debug("Handling a tree element...");
  if (treeElement.contents.clozelike) {
    log.debug("...and it was 🟩  a clozelike");
    return mapper(treeElement);
  } else {
    log.debug("...but it was 🟨  not a clozelike");
    const sameTreeElementCloned: TreeElement<U> = {
      ...treeElement,
    } as unknown as TreeElement<U>; // dirty conversion, this should be necessarily true but maybe fix this eventually
    return sameTreeElementCloned;
  }
}
