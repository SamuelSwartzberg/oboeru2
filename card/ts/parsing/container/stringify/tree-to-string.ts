import { formatSectionLevel } from "../section";
import {
  treeNode,
  TreeNodeSection,
  TreeNodeLeaf,
} from "../parse/parse-into-tree";

export function treeToString(parsedSections: treeNode): string {
  if (parsedSections.children.length === 0) {
    return "";
  } else if (parsedSections.title === "section") {
    return formatSectionLevel(
      (parsedSections as TreeNodeLeaf).children
        .map((line: string) => line.trim())
        .join("\n")
    ); // we know that this is treeNodeLeaf because of the check, but have no way of expressing that in TS in the types
  } else {
    // we know that this is treeNodeGeneric because of the check, but have no way of expressing that in TS in the types
    let newHeader = `<h2 class="${
      !(parsedSections as TreeNodeSection).isGroupShowHeader
        ? "cloze-group"
        : " "
    }">${parsedSections.title}</h2>`;
    let newContent = (parsedSections as TreeNodeSection).children
      .map(treeToString)
      .join("\n");
    if ((parsedSections as TreeNodeSection).title === "root") return newContent;
    else
      return `<article class="indent-${
        (parsedSections as TreeNodeSection).depth - 1
      } headered-container cloze-group">${newHeader}${newContent}</article>`;
  }
}
