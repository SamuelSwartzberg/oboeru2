import log from "loglevel";
import { getClassGroupShow } from "../../../../../../globals";
import { LineSpecifier } from "../../types";
import { BlockElementState, emitHTMLForBlockState } from "./block-elements";
import { linePropertiesToLineConstituents } from "./line-properties";

export interface LineConstitutents {
  content: string;
  elementType: string;
  classes: string[];
  prefix: string;
}

export function stringifyLine(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string[] {
  log.debug("For line specifier:");
  log.debug(line);
  const outputLines: string[] = [];
  const htmlForBlockState = emitHTMLForBlockState(line, blockElementState);
  if (htmlForBlockState) {
    outputLines.push(htmlForBlockState);
  }
  log.debug("...we got the following html for block state...");
  log.debug(htmlForBlockState);
  const lineConstituents = linePropertiesToLineConstituents(line);
  log.debug("...then we got the following line constituents...");
  log.debug(lineConstituents);
  outputLines.push(lineConstituentsToString(lineConstituents));
  log.debug("...stringifyLine yielded:");
  log.debug(outputLines);
  return outputLines;
}

function lineConstituentsToString(lineConstituents: LineConstitutents): string {
  return `<${
    lineConstituents.elementType
  } class="${lineConstituents.classes.join(" ")}">${lineConstituents.prefix}${
    lineConstituents.content
  }</${lineConstituents.elementType}>`;
}
