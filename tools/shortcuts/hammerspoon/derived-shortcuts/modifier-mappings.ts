import { StartEnd } from "../../../ts/parsing/inline/regex-replacement/simple/replacement-mapping";

export type BaseModifierMapping = { [key: string]: StartEnd };

export const baseModifierMapping: BaseModifierMapping = {
  shift: {
    start: "⟮<CHAR>+;",
    end: "⟯",
  },
  option: {
    start: "⟮<CHAR>-;",
    end: "⟯",
  },
  cmd: {
    start: "⟮<CHAR>_;",
    end: "⟯",
  },
};

export const cModifierMapping: BaseModifierMapping = (function () {
  const newEntries = Object.entries(baseModifierMapping).map(([key, value]) => {
    value = {
      ...value,
      start: value.start.replace("<CHAR>", "c"),
    };
    return [key, value];
  });
  const newObject = Object.fromEntries(newEntries);
  newObject.shift.start = "⟮";
  return newObject;
})();
