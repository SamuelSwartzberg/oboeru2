import { LineSpecifier, PossiblyCode, Section } from "../types";
import { parseLineIntoLineSpecifier } from "./line-regex";
import { switchCodeLineState } from "./line-state-switching";

export type LineState = {
  code: PossiblyCode;
};

export function transformTextSection(
  section: Section<string>
): Section<LineSpecifier> {
  const newSubsections = section.subsections.map((subsection) => {
    const newLines: LineSpecifier[] = [];
    const lineState: LineState = {
      code: false,
    };
    for (const line of subsection.lines) {
      const newLine = parseLine(line, lineState);
      if (newLine) {
        newLines.push(newLine);
      }
    }
    return { lines: newLines };
  });
  return { subsections: newSubsections };
}

function parseLine(
  linestring: string,
  lineState: LineState
): LineSpecifier | undefined {
  const wasSwitchLine = switchCodeLineState(linestring, lineState);
  if (wasSwitchLine) {
    return undefined;
  }
  const lineSpecifier: LineSpecifier = {
    content: "",
    properties: {
      small: false,
      blockquote: false,
      listOrdered: false,
      listUnordered: false,
      groupShow: false,
      code: lineState.code,
      indentation: 0,
    },
  };
  parseLineIntoLineSpecifier(linestring, lineSpecifier);
  return lineSpecifier;
}
