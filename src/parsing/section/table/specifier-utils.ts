import { separateIntoSpecifiersAndNonspecifiers } from "../../globals";

export type GenericSpecifier = {
  nonspecifier: string;
  class: string;
  style: string;
};

export type TableSpecifier = {
  headerrows: string;
} & GenericSpecifier;

export type CellSpecifier = {
  span: string;
  type: string;
} & GenericSpecifier;

export function isCellSpecifier(
  specifier: Specifier
): specifier is CellSpecifier {
  return specifier.hasOwnProperty("span");
}

export type Specifier = CellSpecifier | TableSpecifier;

export function parseSpecifiers<SomeSpec extends Specifier>(
  contents: string,
  approvedSpecifierObject: SomeSpec
): SomeSpec {
  let approvedSpecifierObjectKeys = Object.keys(approvedSpecifierObject);
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    function (specfier: string) {
      let [specifierKey, specifierValue] = specfier.split("=");
      if (approvedSpecifierObjectKeys.includes(specifierKey))
        return [specifierKey, specifierValue];
      else return undefined;
    }
  );
  approvedSpecifierObject["nonspecifier"] = nonspecifier;

  return specifiers as SomeSpec;
}
