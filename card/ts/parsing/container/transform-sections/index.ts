import { TreeNode } from "../tree-node";
import { parseSection } from "./sections/switch-for-section";

export function transformSectionsToParsedSections(
  treeNode: TreeNode<string>
): TreeNode<string> {
  let newChildren = treeNode.children.map((child) => {
    if (typeof child === "string") {
      return parseSection(child);
    } else {
      return transformSectionsToParsedSections(child);
    }
  });
  let newTreeNode = {
    ...treeNode,
    children: newChildren,
  };
  return newTreeNode;
}
