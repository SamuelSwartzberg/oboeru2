import log from "loglevel";
import {
  parseClozeLikesToTree,
  parseClozeLikesToTree2,
} from "./1-string-to-tree";
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
  return annotateClozesInStructureWithCountedNumber(
    parseClozeLikesToTree(html),
    true
  );
}
