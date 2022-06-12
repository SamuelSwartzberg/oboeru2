import log from "loglevel";
import { LineSpecifier } from "../types";

var indicatorCharacters: [string, string][] = [
  ["indentation", " +"],
  ["blockquote", "＞ "],
  ["listOrdered", "\\d+\\. "],
  ["listUnordered", "- "],
  ["small", "\\^"],
  ["groupShow", "!"],
];

function buildRegexFromIndicatorCharacters(
  indicatorCharacters: [string, string][]
): RegExp {
  const regexStringPartsJoined = indicatorCharacters
    .map(([key, value]) => {
      return `(?<${key}>${value})?`;
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

export function parseLineIntoLineSpecifier(
  linestring: string,
  lineSpecifier: LineSpecifier
) {
  const regex = buildRegexFromIndicatorCharacters(indicatorCharacters);
  const match = linestring.match(regex);
  log.debug(`Parsing line: ${linestring}`);
  log.debug(`Regex: ${regex}`);
  log.debug(`Match:`);
  log.debug({ ...match });
  if (match) {
    if (match.groups) {
      if (match.groups.content) {
        lineSpecifier.content = match.groups.content;
        delete match.groups.content;
      } else
        throw new Error(
          `No content in match: ${match}, which should be impossible.`
        );
      if (match.groups.indentation) {
        lineSpecifier.properties.indentation = match.groups.indentation.length;
        delete match.groups.indentation;
      }
      for (const [matchName, matchContents] of Object.entries(match.groups)) {
        const propertyName = matchName as LineSpecifierKeyThatIsBoolean;
        lineSpecifier.properties[propertyName] = !!(
          matchContents && matchContents.length > 0
        );
      }
      log.debug(`Line specifier:`);
      log.debug({ ...lineSpecifier });
    } else
      throw new Error(
        `Line matched regex but did not have groups: ${linestring}`
      );
  } else throw new Error(`Line must match regex but doesn't: ${linestring}`);
}
