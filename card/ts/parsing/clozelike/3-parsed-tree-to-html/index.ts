import {
  annnotateWithCountedNumber,
  processCustomClozelikesToString,
} from "../single-clozelike";
import { possiblyRecursiveTArray<string> } from "../1-string-to-tree";

export function reduceTreeToHTML(
  clozeLikeArrayTree: possiblyRecursiveTArray<string>,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, processCustomClozelikesToString);
}

export function annotateClozesInStructureWithCountedNumber(
  clozeLikeArrayTree: possiblyRecursiveTArray<string>,
  isTop: boolean
): string {
  return reduceTree(clozeLikeArrayTree, isTop, annnotateWithCountedNumber);
}



let activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(
      specifiers
    ).join(" ");
  return clozelikeHTMLFromStringConstituents(
    contentAndHint.content,
    activityClasses,
    getHintStyleDeclarationIfAny(contentAndHint.hint)