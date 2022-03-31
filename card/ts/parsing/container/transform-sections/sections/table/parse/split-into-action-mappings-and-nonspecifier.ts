import log from "loglevel";
import { Specifiers } from ".";

var approvedActionNames = ["class", "style", "span", "type", "headerrows"];
var TABLE_SPECIFIERS_SEPARATOR = ";";

export function splitIntoActionMappingAndNonactionmapping(
  str: string
): [Specifiers, string] {
  log.debug(
    "Splitting table specifier into action mapping and nonactionmapping"
  );
  let parts = str.split(TABLE_SPECIFIERS_SEPARATOR);
  let actionmappings: Specifiers = {};
  let nonactionmapping = "";
  let extraClasses = "";
  if (parts[0].startsWith("!")) {
    parts[0] = parts[0].slice(1);
  } else {
    extraClasses = "cloze-group";
  }
  while (parts.length > 0) {
    const part = parts.shift() as string;
    const [trySplitActionName, trySplitActionValue] = part.split("=");
    if (
      trySplitActionName &&
      approvedActionNames.includes(trySplitActionName) &&
      trySplitActionValue
    ) {
      actionmappings[trySplitActionName] = trySplitActionValue;
    } else {
      parts.unshift(part);
      nonactionmapping = parts.join(TABLE_SPECIFIERS_SEPARATOR);
      break;
    }
  }
  actionmappings.class = actionmappings.class
    ? actionmappings.class + " " + extraClasses
    : extraClasses;
  log.debug("Resulted in:");
  log.debug({ ...actionmappings });
  log.debug(nonactionmapping);
  return [actionmappings, nonactionmapping];
}
