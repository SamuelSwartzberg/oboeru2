import { parseDocumentToTree } from "./parse/parse-into-tree";
import { treeToString } from "./stringify/tree-to-string";
import { transformSectionsToParsedSections } from "./transform-sections";

export function parseStructure(html: string): string {
  const tree = parseDocumentToTree(html);
  const treeWithParsedSections = transformSectionsToParsedSections(tree);
  const finalString = treeToString(treeWithParsedSections);
  return finalString;
}
