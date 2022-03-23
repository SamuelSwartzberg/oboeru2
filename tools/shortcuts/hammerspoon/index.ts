import {
  ElementReplacement,
  ElementReplacementMap,
  getReplacementMapping,
  getReplacementMappingUnflattened,
  StartEnd,
} from "../../../card/ts/parsing/inline/regex-replacement/simple/replacement-mapping";
import { StructuredElementReplacementMap } from "../../ts/parsing/inline/regex-replacement/simple/replacement-mapping/replacement-mapping";

type Shortcut = {
  modifiers: string[];
  key: string;
  delimiters: StartEnd;
};

function buildClozeShortcuts(): [Shortcut[], string[]] {
  console.log("dummy function, currently unimplemented");

  return [[], ["c", "h", "s"]];
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

type DelimiterMutatorSpecifier = {
  wrapInside?: {
    start: string;
    end: string;
  };
  wrapOutside?: {
    start: string;
    end: string;
  };
};

function applyDelimiterMutatorSpecifier(
  delimiter: StartEnd,
  delimiterMutatorSpecifier: DelimiterMutatorSpecifier
): StartEnd {
  let returnStartEnd: StartEnd = {
    start: delimiter.start,
    end: delimiter.end,
  };
  console.log(delimiterMutatorSpecifier);

  if (delimiterMutatorSpecifier.wrapOutside) {
    returnStartEnd.start =
      delimiterMutatorSpecifier.wrapOutside.start + delimiter.start;
    returnStartEnd.end =
      delimiter.end + delimiterMutatorSpecifier.wrapOutside.end;
  }
  if (delimiterMutatorSpecifier.wrapInside) {
    returnStartEnd.start =
      returnStartEnd.start + delimiterMutatorSpecifier.wrapInside.start;
    returnStartEnd.end =
      delimiterMutatorSpecifier.wrapInside.end + returnStartEnd.end;
  }
  return returnStartEnd;
}

let possibleModifierMap: { [key: string]: DelimiterMutatorSpecifier } = {
  shift: {
    wrapInside: {
      start: "⟮",
      end: "⟯",
    },
  },
  option: {
    wrapInside: {
      start: "⟮c-;",
      end: "⟯",
    },
  },
  cmd: {
    wrapInside: {
      start: "⟮c_;",
      end: "⟯",
    },
  },
};

let possibleModifierOutsideMap = Object.entries(possibleModifierMap).map(
  ([modifierString, delimiterMutatorSpecifier]) => {
    let delimiterMutatorSpecifierClone = { ...delimiterMutatorSpecifier };
    modifierString = modifierString + " ctrl";
    delimiterMutatorSpecifierClone.wrapOutside =
      delimiterMutatorSpecifierClone.wrapInside;
    delete delimiterMutatorSpecifierClone.wrapInside;
    return [modifierString, delimiterMutatorSpecifierClone];
  }
);

console.log(possibleModifierMap);
console.log(possibleModifierOutsideMap);

possibleModifierMap = Object.fromEntries([
  ...Object.entries(possibleModifierMap),
  ...possibleModifierOutsideMap,
]);

console.log(possibleModifierMap);

function buildDerivedMdStyleShortcuts(
  shortcuts: Shortcut[],
  usedCharArray: string[]
): [Shortcut[], string[]] {
  shortcuts = shortcuts.flatMap((shortcut) => {
    let mappedShortcuts: Shortcut[] = [];
    mappedShortcuts.push(shortcut);
    for (const [modifierString, delimiterMutatorSpecifier] of Object.entries(
      possibleModifierMap
    )) {
      let newShortcut: Shortcut = {
        key: shortcut.key,
        modifiers: modifierString.split(" "),
        delimiters: applyDelimiterMutatorSpecifier(
          shortcut.delimiters,
          delimiterMutatorSpecifier
        ),
      };
      mappedShortcuts.push(newShortcut);
    }
    return mappedShortcuts;
  });
  return [shortcuts, usedCharArray];
}

function buildMdStyleShortcuts(
  shortcuts: Shortcut[],
  usedCharArray: string[]
): [Shortcut[], string[]] {
  [shortcuts, usedCharArray] = buildBasicMdStyleShortcuts(
    shortcuts,
    usedCharArray
  );
  [shortcuts, usedCharArray] = buildDerivedMdStyleShortcuts(
    shortcuts,
    usedCharArray
  );
  return [shortcuts, usedCharArray];
}

type ShortcutAsArray = [string[], string, { start: string; end: string }];

export function buildHammerspoonShortcuts(): ShortcutAsArray[] {
  let [shortcuts, usedCharArray] = buildClozeShortcuts();
  [shortcuts, usedCharArray] = buildMdStyleShortcuts(shortcuts, usedCharArray);

  const shortcutAsArray: ShortcutAsArray[] = shortcuts.map((shortcut) => [
    shortcut.modifiers,
    shortcut.key,
    shortcut.delimiters,
  ]);
  return shortcutAsArray;
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
