import { buildClozeShortcuts } from "./cloze";
import { buildMdStyleShortcuts } from "./md-style";

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
