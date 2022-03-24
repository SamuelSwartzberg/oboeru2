export function splitActionMappingStringIntoNameAndTargetsString(
  actionMappingString: string
): [string, string] {
  let actionNameLength = 0;
  if (actionMappingString[0] === "u") actionNameLength++;
  // starts with u, so at least 2 long
  if (
    actionMappingString[actionNameLength] === "h" &&
    actionMappingString[actionNameLength + 1] === "r"
  )
    actionNameLength += 2;
  // hr/uhr are always one longer
  else if (
    ["c", "s", "h"].some(
      (item) => actionMappingString[actionNameLength] === item
    )
  )
    actionNameLength++;
  else throw new Error("Tried to parse non-specifier into specifier.");
  return [
    actionMappingString.slice(0, actionNameLength),
    actionMappingString.slice(actionNameLength),
  ];
}
