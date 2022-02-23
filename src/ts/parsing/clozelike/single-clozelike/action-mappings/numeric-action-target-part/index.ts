import { handleIndividualNATP } from "./individual-natp";
import { getRangeNATPSeparator, handleRangeNATP } from "./range-natp";

export function handleNumericActionTargetPart(
  actionTargetPart: string,
  isCloze: boolean
): number[] {
  if (actionTargetPart.includes(getRangeNATPSeparator()))
    return handleRangeNATP(actionTargetPart, isCloze);
  else return [handleIndividualNATP(actionTargetPart, isCloze)];
}
