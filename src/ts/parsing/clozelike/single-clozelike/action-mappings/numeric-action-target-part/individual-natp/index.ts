import { handleAbsoluteINATP } from "./absolute-inatp";
import {
  getIncrementSyntaxCharacters,
  handleIncrementINATP,
} from "./crement-inatp";

export function handleIndividualNATP(
  individualNATP: string,
  isCloze: boolean
): number {
  if (
    getIncrementSyntaxCharacters().some((item) =>
      individualNATP.startsWith(item)
    )
  )
    return handleIncrementINATP(individualNATP, isCloze);
  else return handleAbsoluteINATP(individualNATP, isCloze);
}
