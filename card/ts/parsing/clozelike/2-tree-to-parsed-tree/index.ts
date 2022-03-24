import { possiblyRecursiveTArray } from "../globals";
import {
  mapTree,
  TypeWithStringOrStringStringValueAndChildren,
} from "./map-tree";
import {
  Clozelike,
  processStringToClozelike,
} from "./mappers/to-parsed-clozelike";

export function mapTreeToParsedTree(
  clozeLikeTree: possiblyRecursiveTArray<string>
): Clozelike | TypeWithStringOrStringStringValueAndChildren {
  return mapTree<Clozelike>(clozeLikeTree, true, processStringToClozelike);
}
