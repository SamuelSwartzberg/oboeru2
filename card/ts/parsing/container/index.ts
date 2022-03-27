import log from "loglevel";
import { parseDocumentToTree } from "./parse/parse-into-tree";
import { treeToString } from "./stringify/tree-to-string";
import { transformSectionsToParsedSections } from "./transform-sections";
import { isTreeNode, TreeNode } from "./tree-node";

export function parseStructure(html: string): string {
  console.log(html);
  log.setLevel("debug");
  log.debug("Parsing HTML string to tree...");
  const tree = parseDocumentToTree(html);
  testParsedTree(tree);
  log.debug("Parsed tree:");
  log.debug({ ...tree });
  log.debug("Transforming tree to parsed tree...");
  const treeWithParsedSections = transformSectionsToParsedSections(tree);
  log.debug("Transformed tree with parsed sections:");
  log.debug({ ...treeWithParsedSections });
  log.setLevel("info");
  const finalString = treeToString(treeWithParsedSections);
  return finalString;
}

var STRING_CHILD_LENGTH_UPPER_SANITY_LIMIT = 3000;

function testParsedTree(tree: TreeNode<string>) {
  testAnyTree(tree);
  testAllTs(tree, (value) => {
    if (value.length === 0) {
      throw new Error("String children should be non-empty, but is empty.");
    } else if (value.length > STRING_CHILD_LENGTH_UPPER_SANITY_LIMIT) {
      throw new Error(
        `String child is longer than ${STRING_CHILD_LENGTH_UPPER_SANITY_LIMIT} characters, which is likely a mistake.`
      );
    }
  });
}

var TREE_UPPER_SANITY_LIMIT_CHILDREN = 30;

function testAnyTree<T>(tree: TreeNode<T>) {
  if (tree.children.length === 0) {
    throw new Error(`Tree should have at least one child, but has none.`);
  } else {
    testAllNodes(tree, (node) => {
      if (node.children.length > TREE_UPPER_SANITY_LIMIT_CHILDREN) {
        throw new Error(
          `Tree has more than ${TREE_UPPER_SANITY_LIMIT_CHILDREN} children, which is most likely uninteded..`
        );
      }
    });
  }
}

function testAllNodes<T>(
  tree: TreeNode<T>,
  callback: (node: TreeNode<T>) => void
) {
  callback(tree);
  tree.children.forEach((child) => {
    if (isTreeNode(child)) {
      testAllNodes(child, callback);
    }
  });
}

function testAllTs<T>(tree: TreeNode<T>, callback: (value: T) => void) {
  tree.children.forEach((child) => {
    if (isTreeNode(child)) {
      testAllTs(child, callback);
    } else {
      callback(child);
    }
  });
}
