import { buildClozeShortcuts } from "./cloze";
import { Shortcut } from "./derived-shortcuts";
import { buildMdStyleShortcuts } from "./md-style";

type ShortcutAsArray = [string[], string, { start: string; end: string }];

export function buildHammerspoonShortcuts(): ShortcutAsArray[] {
  let [clozeShortcuts, usedCharArray] = buildClozeShortcuts();
  let mdStyleShortcuts: Shortcut[] = [];
  [mdStyleShortcuts, usedCharArray] = buildMdStyleShortcuts(usedCharArray);

  const shortcuts: Shortcut[] = [...clozeShortcuts, ...mdStyleShortcuts];

  const shortcutAsArray: ShortcutAsArray[] = shortcuts.map((shortcut) => [
    shortcut.modifiers,
    shortcut.key,
    shortcut.delimiters,
  ]);
  return shortcutAsArray;
}
