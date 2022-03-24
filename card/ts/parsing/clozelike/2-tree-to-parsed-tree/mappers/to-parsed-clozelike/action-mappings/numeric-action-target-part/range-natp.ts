import { handleIndividualNATP } from "./individual-natp";

var RANGE_NATP_SEPARATOR = ":";

export function getRangeNATPSeparator(): string {
  return RANGE_NATP_SEPARATOR;
}

export function handleRangeNATP(rangeNATP: string, isCloze: boolean): number[] {
  var rangeNATPStartEnd = rangeNATP.split(RANGE_NATP_SEPARATOR);
  var rangeNATPStartEndInt = rangeNATPStartEnd.map((specpart) =>
    handleIndividualNATP(specpart, isCloze)
  );
  return Array.from(
    Array(rangeNATPStartEndInt[1] - rangeNATPStartEndInt[0] + 1).keys()
  ).map((i) => rangeNATPStartEndInt[0] + i);
}
