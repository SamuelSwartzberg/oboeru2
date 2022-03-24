import log from "loglevel";
import { parseClozeLikesToTree } from "./1-string-to-tree";
import { mapTreeToParsedTree } from "./2-tree-to-parsed-tree";
import {
  annotateClozesInStructureWithCountedNumber,
  reduceTreeToHTML,
} from "./3-parsed-tree-to-html";

export function parseClozelikes(html: string): string {
  const clozeLikeTree = parseClozeLikesToTree(html);
  log.debug("Parsed cloze-like tree: ");
  log.debug(clozeLikeTree);
  const parsedTree = mapTreeToParsedTree(clozeLikeTree);
  return reduceTreeToHTML(parsedTree, true);
}

export function annotateNumber(html: string): string {
  throw new Error("Not implemented");
  // return annotateClozesInStructureWithCountedNumber(
  //   parseClozeLikesToTree(html),
  //   true
  // );
}
