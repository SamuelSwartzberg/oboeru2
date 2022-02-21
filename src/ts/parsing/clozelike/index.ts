import { parseClozeLikesToTree } from "./parse-to-tree";
import { replaceClozeLikes } from "./tree-to-string";

export function parseClozelikes(html: string): string {
  return replaceClozeLikes(parseClozeLikesToTree(html), true);
}
