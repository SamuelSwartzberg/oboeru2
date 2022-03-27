import { getClassGroupShow } from "../../globals";
import { TreeNode, treeNodeIsTreeNodeSection } from "../parse/parse-into-tree";

export function treeToString(parsedSections: TreeNode<string>): string {
  const childrenString = parsedSections.children
    .map((child) => {
      if (typeof child === "string") {
        return child;
      } else {
        return treeToString(child);
      }
    })
    .join("\n");
  if (treeNodeIsTreeNodeSection(parsedSections)) {
    const header = buildHeader(
      parsedSections.title,
      parsedSections.isGroupShowHeader
    );
    return buildArticle(header, childrenString, parsedSections.depth);
  } else {
    return childrenString;
  }
}

function buildHeader(title: string, isGroupShowHeader: boolean): string {
  return `<h2 class="${!getClassGroupShow(isGroupShowHeader)}">${title}</h2>`;
}

function buildArticle(header: string, content: string, depth: number): string {
  return `<article class="indent-${depth - 1} headered-container cloze-group">
    ${header}
    ${content}
  </article>`;
}
