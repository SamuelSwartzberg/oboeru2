import { StartEnd } from "../../../ts/parsing/inline/regex-replacement/simple/replacement-mapping";

export type Shortcut = {
  modifiers: string[];
  key: string;
  delimiters: StartEnd;
};

type ValueOf<T> = T[keyof T];

export function buildDerivedShortcuts<T extends { [key: string]: any }>(
  shortcuts: Shortcut[],
  modifierMapping: T,
  delimiterRetriever: (
    key: string,
    delimiters: StartEnd,
    modifierMapping: ValueOf<T>
  ) => StartEnd
): Shortcut[] {
  shortcuts = shortcuts.flatMap((shortcut) => {
    let mappedShortcuts: Shortcut[] = [];
    mappedShortcuts.push(shortcut);
    for (const [modifierString, delimiterMutatorSpecifier] of Object.entries(
      modifierMapping
    )) {
      let newShortcut: Shortcut = {
        key: shortcut.key,
        modifiers: modifierString.split(" "),
        delimiters: delimiterRetriever(
          shortcut.key,
          shortcut.delimiters,
          delimiterMutatorSpecifier
        ),
      };
      mappedShortcuts.push(newShortcut);
    }
    return mappedShortcuts;
  });
  return shortcuts;
}
