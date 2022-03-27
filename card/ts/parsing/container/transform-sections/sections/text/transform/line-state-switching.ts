import { LineState } from ".";

var CODEBLOCK_DELIMITER = "```";

export function switchCodeLineState(
  linestring: string,
  lineState: LineState
): boolean {
  if (linestring.startsWith(CODEBLOCK_DELIMITER)) {
    if (lineState.code === false) {
      const potentialCodetype = linestring.slice(CODEBLOCK_DELIMITER.length);
      if (potentialCodetype.length > 0) {
        lineState.code = {
          codetype: potentialCodetype,
        };
      } else
        lineState.code = {
          codetype: undefined,
        };
    } else {
      lineState.code = false;
    }
    return true;
  }
  return false;
}
