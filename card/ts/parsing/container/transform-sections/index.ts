import { TreeNode } from "../parse/parse-into-tree";
import { switchParseSection } from "./sections/switch-for-section";

export function transformSectionsToParsedSections(
  treeNode: TreeNode<string>
): TreeNode<string> {
  let newChildren = treeNode.children.map((child) => {
    if (typeof child === "string") {
      return switchParseSection(child);
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
