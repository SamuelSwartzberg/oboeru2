import { BooleanClozelike } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "./globals";
import { Clozelike } from "./mappers/parse-action-mapping-to-action-targets/parse-action-targets/inddex";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<ClozeContents> {}
