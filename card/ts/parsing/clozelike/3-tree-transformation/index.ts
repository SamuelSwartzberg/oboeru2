import log from "loglevel";
import { BooleanClozelike } from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "./globals";
import { mapTree } from "./map-tree";
import {
  parseActionMapping,
  WithParsedActionMappings,
} from "./mappers/parse-action-mapping-to-action-targets";
import { separateHint, WithHint } from "./mappers/separate-hint";
import { WithSplitActionMappings } from "./mappers/splitting/split-action-mapping";
import {
  splitSpecifier,
  WithSpecifier,
} from "./mappers/splitting/split-specifier";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<WithParsedActionMappings> {
  const hintSeparatedTree = mapTree<BooleanClozelike, WithHint>(
    structuredTree,
    true,
    separateHint
  );
  log.debug(hintSeparatedTree);
  const splitSpeciferTree = mapTree<WithHint, WithSpecifier>(
    hintSeparatedTree,
    true,
    splitSpecifier
  );
  log.debug(splitSpeciferTree);
  const splitActionMappingTree = mapTree<
    WithSpecifier,
    WithSplitActionMappings
  >(splitSpeciferTree, true, splitSpecifier);
  log.debug(splitActionMappingTree);
  const parsedActionMappingTree = mapTree<
    WithSplitActionMappings,
    WithParsedActionMappings
  >(splitActionMappingTree, true, parseActionMapping);
  log.debug(parsedActionMappingTree);
  return parsedActionMappingTree;
}
splitSpecifier;
