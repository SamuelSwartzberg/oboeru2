import { parseClozeLikesToTree, parseClozeLikesToTree2 } from "./parse-to-tree";
import {
  annotateClozesInStructureWithCountedNumber,
  replaceClozeLikes,
} from "./tree-to-string";

export function parseClozelikes(html: string): string {
  return replaceClozeLikes(parseClozeLikesToTree(html), true);
}

export function annotateNumber(html: string): string {
  return annotateClozesInStructureWithCountedNumber(
    parseClozeLikesToTree(html),
    true
  );
}
