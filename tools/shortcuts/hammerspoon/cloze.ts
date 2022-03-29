import { Shortcut } from "./derived-shortcuts";
import { buildClozelikeShortcuts } from "./derived-shortcuts/cloze";

function buildDummyShortcutsFromBaseChars(baseChars: string[]): Shortcut[] {
  return baseChars.map((baseChar) => ({
    modifiers: [],
    key: baseChar,
    delimiters: { start: "⟮", end: "⟯" },
  }));
}

export function buildClozeShortcuts(): [Shortcut[], string[]] {
  const baseChars = ["c", "h", "s"];
  const dummyShortcuts = buildDummyShortcutsFromBaseChars(baseChars);
  const actualShortcuts = buildClozelikeShortcuts(dummyShortcuts);

  return [actualShortcuts, ["c", "h", "s"]];
}
