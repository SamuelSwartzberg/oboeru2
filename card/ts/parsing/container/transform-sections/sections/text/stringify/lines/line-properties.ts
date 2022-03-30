import { LineConstitutents } from ".";
import { getClassGroupShow } from "../../../../../../globals";
import { LineSpecifier } from "../../types";

export function linePropertiesToLineConstituents(
  line: LineSpecifier
): LineConstitutents {
  const lineConstituents: LineConstitutents = {
    content: line.content,
    elementType: "span",
    classes: ["line"],
    prefix: "",
  };
  if (line.properties["listOrdered"] || line.properties["listUnordered"]) {
    lineConstituents.elementType = "li";
  }
  if (line.properties["listOrdered"]) lineConstituents.classes.push("ordered");
  if (line.properties["listUnordered"])
    lineConstituents.classes.push("unordered");
  if (line.properties.small) lineConstituents.classes.push("sub");
  if (!line.properties.groupShow)
    lineConstituents.classes.push(getClassGroupShow(false));
  if (line.properties.indentation)
    lineConstituents.prefix = "&nbsp;".repeat(line.properties.indentation);
  return lineConstituents;
}
