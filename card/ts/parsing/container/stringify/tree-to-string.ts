import { getClassGroupShow } from "../../globals";
import { TreeNode, treeNodeIsTreeNodeSection } from "../tree-node";

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
  return `<summary class="${getClassGroupShow(
    isGroupShowHeader
  )}"><h2>${title}</h2></summary>`;
}

function buildArticle(header: string, content: string, depth: number): string {
  return `<details class="depth-${depth} headered-container cloze-group">
    ${header}
    ${content}
  </details>`;
}
