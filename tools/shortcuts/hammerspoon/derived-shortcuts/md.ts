import { buildDerivedShortcuts, Shortcut } from ".";
import { StartEnd } from "../../../ts/parsing/inline/regex-replacement/simple/replacement-mapping";
import { cModifierMapping } from "./modifier-mappings";

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

type MutatorModifierMapping = { [key: string]: DelimiterMutatorSpecifier };

const possibleModifierMap: MutatorModifierMapping = (function () {
  const newEntries = Object.entries(cModifierMapping).flatMap(
    ([key, value]) => {
      const newValueInside = {
        wrapInside: {
          ...value,
        },
      };
      const newValueOutside = {
        wrapOutside: {
          ...value,
        },
      };
      const newKeyOutside = `${key} ctrl`;
      return [
        [key, newValueInside],
        [newKeyOutside, newValueOutside],
      ];
    }
  );
  const newObject = Object.fromEntries(newEntries);
  return newObject;
})();

function applyDelimiterMutatorSpecifier(
  key: string,
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

export function buildDerivedMdStyleShortcuts(
  shortcuts: Shortcut[]
): Shortcut[] {
  return buildDerivedShortcuts(
    shortcuts,
    possibleModifierMap,
    applyDelimiterMutatorSpecifier
  );
}
