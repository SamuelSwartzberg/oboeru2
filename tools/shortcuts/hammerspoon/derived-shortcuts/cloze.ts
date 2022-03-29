import { buildDerivedShortcuts, Shortcut } from ".";
import { StartEnd } from "../../../ts/parsing/inline/regex-replacement/simple/replacement-mapping";
import { BaseModifierMapping, baseModifierMapping } from "./modifier-mappings";

export function buildClozelikeShortcuts(shortcuts: Shortcut[]) {
  const initialDerivedShortcuts = buildDerivedShortcuts<BaseModifierMapping>(
    shortcuts,
    baseModifierMapping,
    clozelikeGenerator
  );
  return initialDerivedShortcuts;
}

export function clozelikeGenerator(
  key: string,
  delimiters: StartEnd,
  mutatorSpecifier: StartEnd
): StartEnd {
  return {
    ...mutatorSpecifier,
    start: mutatorSpecifier.start.replace("<CHAR>", key),
  };
}
