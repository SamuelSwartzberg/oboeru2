import { BooleanClozelike } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "./globals";
import { Clozelike } from "./mappers/to-parsed-clozelike";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<ClozeContents> {}
