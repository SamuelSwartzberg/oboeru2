var approvedActionNames = ["c", "s", "h", "us", "uh", "uhb"];
var approvedActionNamesReversed = approvedActionNames.reverse();
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
var approvedActionTargetCharacters = [
  "a",
  "b",
  "+",
  "-",
  "_",
  "∞",
  ",",
  ...numbers.map((n) => n.toString()),
];

function isActionMappingCheapTest(str: string): false | undefined {
  if (!approvedActionTargetCharacters.includes(str[str.length - 1])) {
    return false;
  } else return undefined;
}

export function splitActionMapping(actionMapping: string): [string, string] {
  for (const approvedActionName of approvedActionNamesReversed) {
    if (actionMapping.startsWith(approvedActionName)) {
      return [
        approvedActionName,
        actionMapping.slice(approvedActionName.length),
      ];
    }
  }
  throw new Error("Tried to split non-action mapping into action mapping.");
}

function isActionMappingExpensive(str: string): boolean {
  for (const approvedActionName of approvedActionNamesReversed) {
    if (str.startsWith(approvedActionName)) {
      str = str.slice(approvedActionName.length);
      if (str.length === 0) return false;
      for (const char of str) {
        if (!approvedActionTargetCharacters.includes(char)) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

export function isActionMapping(str: string): boolean {
  return isActionMappingCheapTest(str) === undefined
    ? isActionMappingExpensive(str)
    : false;
}
