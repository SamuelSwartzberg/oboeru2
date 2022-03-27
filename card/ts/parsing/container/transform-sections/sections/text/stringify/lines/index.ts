import { getClassGroupShow } from "../../../../../../globals";
import { LineSpecifier } from "../../types";
import { BlockElementState, emitHTMLForBlockState } from "./block-elements";
import { linePropertiesToLineConstituents } from "./line-properties";

export interface LineConstitutents {
  content: string;
  elementType: string;
  classes: string[];
}

export function stringifyLine(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string[] {
  const outputLines: string[] = [];
  const htmlForBlockState = emitHTMLForBlockState(line, blockElementState);
  if (htmlForBlockState) {
    outputLines.push(htmlForBlockState);
  }
  const lineConstituents = linePropertiesToLineConstituents(line);
  outputLines.push(lineConstituentsToString(lineConstituents));
  return outputLines;
}

function lineConstituentsToString(lineConstituents: LineConstitutents): string {
  return `<${
    lineConstituents.elementType
  } class="${lineConstituents.classes.join(" ")}">${
    lineConstituents.content
  }</${lineConstituents.elementType}>`;
}
