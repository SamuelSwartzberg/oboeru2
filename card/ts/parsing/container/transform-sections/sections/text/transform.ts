import { LineSpecifier, PossiblyCode, Section } from "./types";

type LineState = {
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

var indicatorCharacters = {};

var CODEBLOCK_DELIMITER = "```";

function parseLine(
  linestring: string,
  lineState: LineState
): LineSpecifier | undefined {
  if (linestring.startsWith(CODEBLOCK_DELIMITER)) {
    switchCodeLineState(linestring, lineState);
    return undefined;
  }
}

function switchCodeLineState(linestring: string, lineState: LineState) {
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
}
