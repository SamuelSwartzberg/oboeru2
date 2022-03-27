export interface TreeNode<T> {
  children: (TreeNode<T> | T)[];
  type: "section" | "root";
}

export function isTreeNode<T>(node: any): node is TreeNode<T> {
  return (
    node &&
    node.children &&
    node.type &&
    (node.type === "section" || node.type === "root")
  );
}

export interface TreeNodeSection<T> extends TreeNode<T> {
  type: "section";
  title: string;
  depth: number;
  isGroupShowHeader: boolean;
}

export function treeNodeIsTreeNodeSection(
  node: TreeNode<string>
): node is TreeNodeSection<string> {
  return node.type === "section";
}

export interface TreeNodeRoot<T> extends TreeNode<T> {
  type: "root";
}
