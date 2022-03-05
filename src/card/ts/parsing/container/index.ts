import { parseToplevel } from "./parse-into-tree";
import { treeToString } from "./tree-to-string";

export function parseStructure(html: string): string {
  return treeToString(parseToplevel(html));
}
