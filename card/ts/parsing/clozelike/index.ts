import log from "loglevel";
import { parseClozelikeStringToTree } from "./1-string-to-tree";
import { mapTreeToStructuredTree } from "./2-tree-to-structured-tree";
import {
  annotateClozesInStructureWithCountedNumber,
  reduceTreeToHTML,
} from "./4-parsed-tree-to-html";

export function parseClozelikes(html: string): string {
  const treeWithClozelikesRepresentedAsNestedArrays =
    parseClozelikeStringToTree(html);
  log.debug(treeWithClozelikesRepresentedAsNestedArrays);
  const treeWithClozelikesStoredInChildrenAndValuesSeparatedOut =
    mapTreeToStructuredTree(treeWithClozelikesRepresentedAsNestedArrays);
  log.debug(treeWithClozelikesStoredInChildrenAndValuesSeparatedOut);
  const treeWithClozelikesParsedToObject = mapStructuredTreeToParsedClozelikes(
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut
  );
  log.debug(treeWithClozelikesParsedToObject);
  return reduceTreeToHTML(
    treeWithClozelikesStoredInChildrenAndValuesSeparatedOut,
    true
  );
}

export function annotateNumber(html: string): string {
  throw new Error("Not implemented");
  // return annotateClozesInStructureWithCountedNumber(
  //   parseClozeLikesToTree(html),
  //   true
  // );
}
