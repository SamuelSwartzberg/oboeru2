export function separateIntoSpecifiersAndNonspecifiers<T>(
  contents: string,
  parseSpecifierIntoKeyValueCallback: (
    specifier: string
  ) => [string, T] | undefined
): [
  string,
  {
    [k: string]: T;
  }
] {
  let constituents: string[] = contents.split(";");
  let nonspecifier = "";
  let specifiers: {
    [k: string]: T;
  } = {};
  for (let i = 0; i < constituents.length; i++) {
    // make sure that only approved specifiers count as specifiers, to allow ; in the contents
    if (i === constituents.length - 1) {
      // final loop, no need to do any checking, the last thing can't be a specifier
      nonspecifier = constituents.slice(i).join(";");
      break;
    }
    let constituentAsSpecifier = parseSpecifierIntoKeyValueCallback(
      constituents[i]
    );
    if (!constituentAsSpecifier) {
      // part doesn't start with an approved specifier
      nonspecifier = constituents.slice(i).join(";"); // so we're done with the specifier part, rejoin the thing.
      break;
    } else {
      specifiers[constituentAsSpecifier[0]] = constituentAsSpecifier[1]; // this is a specifier, so add it to the specifiers
    }
  }
  return [nonspecifier, specifiers];
}
