import log from "loglevel";
import { parseClozelikeStringToTree } from "./parse-to-array-tree";
import { mapTreeToStructuredTree } from "./transform-array-tree-to-structured-tree";
import { mapStructuredTreeToParsedClozelikes } from "./transform-tree";
import { reduceTreeToCardHTML } from "./stringify";

export function parseClozelikes(html: string): string {
  const treeWithClozelikesRepresentedAsNestedArrays =
    parseClozelikeStringToTree(html);
  log.debug("The tree with clozelikes represented as nested arrays is:");
  log.debug(
    JSON.stringify(treeWithClozelikesRepresentedAsNestedArrays, null, 2)
  );
  const treeWithClozelikesStoredInChildrenAndValuesSeparatedOut =
    mapTreeToStructuredTree(treeWithClozelikesRepresentedAsNestedArrays);
  if (
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut.children.length ===
    0
  )
    throw new Error(
      "The tree with clozelikes stored in children and values separated out has no children.."
    );
  log.debug(
    "The tree with clozelikes stored in children and values separated out is:"
  );
  log.debug(
    JSON.stringify(
      treeWithClozelikesStoredInChildrenAndValuesSeparatedOut,
      null,
      2
    )
  );
  const treeWithClozelikesParsedToObject = mapStructuredTreeToParsedClozelikes(
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut
  );
  if (treeWithClozelikesParsedToObject.children.length === 0)
    throw new Error(
      "The tree with clozelikes parsed to object has no children.."
    );
  log.debug("The tree with clozelikes parsed to objects is:");
  log.debug(JSON.stringify(treeWithClozelikesParsedToObject, null, 2));
  return reduceTreeToCardHTML(treeWithClozelikesParsedToObject, true);
}
