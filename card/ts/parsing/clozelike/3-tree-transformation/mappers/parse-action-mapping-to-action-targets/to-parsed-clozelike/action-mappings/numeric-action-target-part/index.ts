import log from "loglevel";
import { handleIndividualNATP } from "./individual-natp";
import { getRangeNATPSeparator, handleRangeNATP } from "./range-natp";

export function handleNumericActionTargetPart(
  actionTargetPart: string,
  isCloze: boolean
): number[] {
  let NATP: number[] = [];
  if (actionTargetPart.includes(getRangeNATPSeparator()))
    NATP = handleRangeNATP(actionTargetPart, isCloze);
  else NATP = [handleIndividualNATP(actionTargetPart, isCloze)];
  return NATP;
}
