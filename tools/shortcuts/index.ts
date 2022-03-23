import { buildEspansoShortcuts } from "./espanso";
import { buildHammerspoonShortcuts } from "./hammerspoon";
import fs from "fs";

export function buildShortcuts() {
  buildEspansoShortcuts();
  fs.writeFileSync(
    process.env.HSCONFIG_ANKI_KEYBOARD_SHORTCUTS as string,
    JSON.stringify(buildHammerspoonShortcuts(), null, 2)
  );
}
