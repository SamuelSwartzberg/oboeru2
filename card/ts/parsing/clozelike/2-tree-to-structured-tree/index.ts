import { TreeElement } from "../3-tree-transformation/globals";
import { possiblyRecursiveTArray } from "../globals";
import {
  BooleanClozelike,
  mapStringTreeToStructuredTree,
} from "./map-string-tree-to-structured-tree";

export function mapTreeToStructuredTree(
  clozeLikeTree: possiblyRecursiveTArray<string>
): TreeElement<BooleanClozelike> {
  return mapStringTreeToStructuredTree(clozeLikeTree, true);
}
