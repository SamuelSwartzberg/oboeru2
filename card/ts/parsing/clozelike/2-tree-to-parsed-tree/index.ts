import { possiblyRecursiveTArray } from "../globals";
import {
  ClozelikeWithChildren,
  mapTree,
  TypeWithValueAndChildren,
} from "./map-tree";
import {
  Clozelike,
  processStringToClozelike,
} from "./mappers/to-parsed-clozelike";

export function mapTreeToParsedTree(
  clozeLikeTree: possiblyRecursiveTArray<string>
): ClozelikeWithChildren | TypeWithValueAndChildren {
  return mapTree<Clozelike>(clozeLikeTree, true, processStringToClozelike);
}
