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
  return [actionmappings, nonactionmapping];
}
