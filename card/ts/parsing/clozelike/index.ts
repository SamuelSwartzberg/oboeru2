import log from "loglevel";
import { parseClozelikeStringToTree } from "./1-string-to-tree";
import { mapTreeToStructuredTree } from "./2-tree-to-structured-tree";
import { mapStructuredTreeToParsedClozelikes } from "./3-tree-transformation";
import { reduceTreeToHTML } from "./4-parsed-tree-to-html";

export function parseClozelikes(html: string): string {
  const treeWithClozelikesRepresentedAsNestedArrays =
    parseClozelikeStringToTree(html);
  log.debug("The tree with clozelikes represented as nested arrays is:");
  log.debug(treeWithClozelikesRepresentedAsNestedArrays);
  const treeWithClozelikesStoredInChildrenAndValuesSeparatedOut =
    mapTreeToStructuredTree(treeWithClozelikesRepresentedAsNestedArrays);
  log.debug(
    "The tree with clozelikes stored in children and values separated out is:"
  );
  log.debug(treeWithClozelikesStoredInChildrenAndValuesSeparatedOut);
  const treeWithClozelikesParsedToObject = mapStructuredTreeToParsedClozelikes(
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut
  );
  log.debug("The tree with clozelikes parsed to objects is:");
  log.debug(treeWithClozelikesParsedToObject);
  return reduceTreeToHTML(
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut,
    true
  );
}
