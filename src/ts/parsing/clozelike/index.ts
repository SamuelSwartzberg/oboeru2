import { parseClozeLikesToTree, parseClozeLikesToTree2 } from "./parse-to-tree";
import { replaceClozeLikes } from "./tree-to-string";

export function parseClozelikes(html: string): string {
  console.log(parseClozeLikesToTree2(html));
  return replaceClozeLikes(parseClozeLikesToTree(html), true);
}
