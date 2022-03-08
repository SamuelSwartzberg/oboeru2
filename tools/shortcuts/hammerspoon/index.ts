import {
  getReplacementMapping,
  StartEnd,
} from "../../../card/ts/parsing/inline/regex-replacement/simple/replacement-mapping";

type Shortcut = {
  modifiers: string[];
  key: string;
  delimiters: string | StartEnd;
};

export function buildHammerspoonShortcuts() {
  let replacementMapping = getReplacementMapping();
  let usedCharArray: string[] = ["c", "h", "s"];
  let shortcuts: Shortcut[] = [];
  for (const [htmlName, mapping] of Object.entries(
    replacementMapping.mdStyle
  )) {
    let usedChar = getUsedChar(htmlName, usedCharArray);
    let shortcut: Shortcut = {
      modifiers: [],
      key: usedChar,
      delimiters: mapping.delimiters,
    };
    shortcuts.push(shortcut);
  }
}

function getUsedChar(htmlName: string, usedCharArray: string[]): string {
  for (const char of htmlName) {
    if (!usedCharArray.includes(char)) {
      usedCharArray.push(char);
      return char;
    }
  }
  throw new Error(`Could not find unused char for ${htmlName}`);
}
