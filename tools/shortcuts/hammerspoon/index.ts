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
  console.log(mdStyleEntries);

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
    console.log(shortcut);

    shortcuts.push(shortcut);
  }
  console.log(JSON.stringify(shortcuts, null, 2));
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
  if (delimiterMutatorSpecifier.wrapOutside) {
    delimiter.start =
      delimiterMutatorSpecifier.wrapOutside.start + delimiter.start;
    delimiter.end = delimiter.end + delimiterMutatorSpecifier.wrapOutside.end;
  }
  if (delimiterMutatorSpecifier.wrapInside) {
    delimiter.start =
      delimiter.start + delimiterMutatorSpecifier.wrapInside.start;
    delimiter.end = delimiterMutatorSpecifier.wrapInside.end + delimiter.end;
  }
  return delimiter;
}

let possibleModifierMap: { [key: string]: DelimiterMutatorSpecifier } = {
  "": {},
  shift: {
    wrapInside: {
      start: "⟮c+;",
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
    modifierString = modifierString + " ctrl";
    delimiterMutatorSpecifier.wrapOutside =
      delimiterMutatorSpecifier.wrapInside;
    delete delimiterMutatorSpecifier.wrapInside;
    return [modifierString, delimiterMutatorSpecifier];
  }
);

possibleModifierMap = Object.fromEntries([
  ...Object.entries(possibleModifierMap),
  ...possibleModifierOutsideMap,
]);

function buildDerivedMdStyleShortcuts(
  shortcuts: Shortcut[],
  usedCharArray: string[]
): [Shortcut[], string[]] {
  shortcuts.flatMap((shortcut) => {
    let mappedShortcuts: Shortcut[] = [];
    for (const [modifierString, delimiterMutatorSpecifier] of Object.entries(
      possibleModifierMap
    )) {
      let newShortcut: Shortcut = {
        key: shortcut.key,
        modifiers: modifierString.split("\n"),
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

export function buildHammerspoonShortcuts() {
  let [shortcuts, usedCharArray] = buildClozeShortcuts();
  [shortcuts, usedCharArray] = buildMdStyleShortcuts(shortcuts, usedCharArray);
  console.log(JSON.stringify(shortcuts, null, 2));
}

function getUsedChar(htmlName: string, usedCharArray: string[]): string {
  const aliases: { [key: string]: string } = {
    sub: "_",
    sup: "^",
  };

  // if we have an explicit alias, use that
  if (htmlName in aliases) {
    usedCharArray.push(aliases[htmlName]);
    return aliases[htmlName];
  }

  // else use a character from its name that hasn't been used yet
  for (const char of htmlName) {
    if (!usedCharArray.includes(char)) {
      usedCharArray.push(char);
      return char;
    }
  }
  throw new Error(`Could not find unused char for ${htmlName}`);
}
