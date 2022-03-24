import { Clozelike } from "../../2-tree-to-structured-tree/mappers/to-parsed-clozelike";

export function annnotateWithCountedNumber(clozelike: Clozelike): string {
  throw new Error("not implemented");
  // const specifierRestringified = Object.entries(clozelike.specifiers)
  //   .map(([specifier, specifierValue]) => {
  //     const specifierValueString = specifierValue.join(",");
  //     return `${specifier}${specifierValueString}`;
  //   })
  //   .join(";");
  // return `⟮${specifierRestringified};${nonspecifier}⟯`;
}
