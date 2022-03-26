import { currentCardIndex } from "../../../../../anki-card";
import { ActionTargetsObject } from "../../../transform-tree/mappers/parse-action-mapping-to-action-targets/parse-action-targets";

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
