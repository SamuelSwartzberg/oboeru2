import { parseToplevel } from "./parse/parse-into-tree";
import { treeToString } from "./stringify/tree-to-string";

export function parseStructure(html: string): string {
  return treeToString(parseToplevel(html));
}
