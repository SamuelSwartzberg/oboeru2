import log from "loglevel";
import { parseClozeLikesToTree, parseClozeLikesToTree2 } from "./parse-to-tree";
import {
  annotateClozesInStructureWithCountedNumber,
  replaceClozeLikes,
} from "./tree-to-string";

export function parseClozelikes(html: string): string {
  const clozeLikeTree = parseClozeLikesToTree(html);
  log.debug("Parsed cloze-like tree: ");
  log.debug(clozeLikeTree);
  return replaceClozeLikes(clozeLikeTree, true);
}

export function annotateNumber(html: string): string {
  return annotateClozesInStructureWithCountedNumber(
    parseClozeLikesToTree(html),
    true
  );
}
