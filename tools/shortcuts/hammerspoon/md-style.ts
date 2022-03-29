import {
  ElementReplacement,
  getReplacementMappingUnflattened,
} from "../../../card/ts/parsing/inline/regex-replacement/simple/replacement-mapping";
import { StructuredElementReplacementMap } from "../../ts/parsing/inline/regex-replacement/simple/replacement-mapping/replacement-mapping";
import { Shortcut } from "./derived-shortcuts";
import { buildDerivedMdStyleShortcuts } from "./derived-shortcuts/md";

export function buildMdStyleShortcuts(
  usedCharArray: string[]
): [Shortcut[], string[]] {
  let shortcuts: Shortcut[] = [];
  [shortcuts, usedCharArray] = buildBasicMdStyleShortcuts(
    shortcuts,
    usedCharArray
  );
  shortcuts = buildDerivedMdStyleShortcuts(shortcuts);
  return [shortcuts, usedCharArray];
}

function buildBasicMdStyleShortcuts(
  shortcuts: Shortcut[],
  usedCharArray: string[]
): [Shortcut[], string[]] {
  let replacementMapping: StructuredElementReplacementMap =
    getReplacementMappingUnflattened();
  let mdStyleEntries: [string, ElementReplacement][] = Object.entries(
    replacementMapping.mdStyle
  );
  // sort mdStyleEntries by length of key to make sure one-character shortcuts don't have their keys eaten up
  mdStyleEntries.sort((a, b) => a[0].length - b[0].length);

  for (const [htmlName, mapping] of mdStyleEntries) {
    let usedChar = getUsedChar(htmlName, usedCharArray);
    if (typeof mapping.delimiters === "string") {
      mapping.delimiters = {
        start: mapping.delimiters,
        end: mapping.delimiters,
      };
    }
    let shortcut: Shortcut = {
      modifiers: [],
      key: usedChar,
      delimiters: mapping.delimiters,
    };

    shortcuts.push(shortcut);
  }
  return [shortcuts, usedCharArray];
}

function getUsedChar(htmlName: string, usedCharArray: string[]): string {
  const aliases: { [key: string]: string } = {
    sub: "0",
    sup: "1",
  };

  // if we have an explicit alias, use that
  if (htmlName in aliases) {
    usedCharArray.push(aliases[htmlName]);
    return aliases[htmlName];
  }

  // else use a character from its name that hasn't been used yet
  for (let char of htmlName) {
    char = char.toLowerCase();
    if (!usedCharArray.includes(char)) {
      usedCharArray.push(char);
      return char;
    }
  }
  throw new Error(`Could not find unused char for ${htmlName}`);
}
