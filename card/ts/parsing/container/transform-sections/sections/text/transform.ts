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

var indicatorCharacters: [string, string][] = [
  ["indentation", " +"],
  ["blockquote", "＞ "],
  ["listOrdered", "\\,\\. "],
  ["listUnordered", "- "],
  ["small", "^"],
  ["groupShow", "!"],
];

var CODEBLOCK_DELIMITER = "```";

function parseLine(
  linestring: string,
  lineState: LineState
): LineSpecifier | undefined {
  if (linestring.startsWith(CODEBLOCK_DELIMITER)) {
    switchCodeLineState(linestring, lineState);
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

function buildRegexFromIndicatorCharacters(
  indicatorCharacters: [string, string][]
): RegExp {
  const regexStringPartsJoined = indicatorCharacters
    .map(([key, value]) => {
      return `(?<${key}>(?:${value})?)`;
    })
    .join("");
  return new RegExp(`^${regexStringPartsJoined}(?<content>.*)$`);
}

type LineSpecifierKeyThatIsBoolean =
  | "small"
  | "blockquote"
  | "listOrdered"
  | "listUnordered"
  | "groupShow";

function parseLineIntoLineSpecifier(
  linestring: string,
  lineSpecifier: LineSpecifier
) {
  const regex = buildRegexFromIndicatorCharacters(indicatorCharacters);
  const match = linestring.match(regex);
  if (match) {
    if (match.groups) {
      lineSpecifier.content = match.groups.content;
      delete match.groups.content;
      lineSpecifier.properties.indentation = match.groups.indentation.length;
      delete match.groups.indentation;
      for (const [matchName, matchContents] of Object.entries(match.groups)) {
        const propertyName = matchName as LineSpecifierKeyThatIsBoolean;
        lineSpecifier.properties[propertyName] = matchContents !== undefined;
      }
    } else
      throw new Error(
        `Line matched regex but did not have groups: ${linestring}`
      );
  } else throw new Error(`Line must match regex but doesn't: ${linestring}`);
}
