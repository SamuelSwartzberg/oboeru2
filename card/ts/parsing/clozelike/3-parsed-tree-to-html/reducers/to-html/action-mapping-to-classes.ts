import { currentCardIndex } from "../../../../../anki-card";
import { ActionTargetsObject } from "../../../2-tree-to-parsed-tree/mappers/to-parsed-clozelike/action-mappings";

export function getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(specifierMapping: {
  [k: string]: ActionTargetsObject;
}): string[] {
  return Object.entries(specifierMapping).map(([specifierType, specifier]) => {
    let classList: string[] = [];
    if (specifier.group) classList.push(`${specifierType}-${specifier.group}`);
    if (specifier.all) classList.push(`${specifierType}-active`);
    else if (specifier.cardsForWhichToApply.includes(currentCardIndex()))
      classList.push(`${specifierType}-active`);
    return classList.join(" ");
  });
}
