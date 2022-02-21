/* 
type SituationMessage = "level change" | "same level new item" | "token push";

function parseTree<T extends TreeNode>(
  unparsedStringTree: string,
  options: TreeParsingOptions
): T {
  
  let labelAccumulator: string[] = [];
  let lastDepth: number = 0;
  let tokens: string[] = unparsedStringTree.split(options.splitter);

  for (const token of tokens) {
    if (options.isLevelChangingSituation(token, labelAccumulator)) {

    } else if (options.isSameLevelNewItemSituation(token, labelAccumulator)) {
      
      if (treeNodeIsLeaf(topStackElement))
        throw new Error("can't push onto leaf");
      else
        topStackElement.children.push({
          depth: lastDepth,
          children: labelAccumulator,
        });
    } else {
      labelAccumulator.push(token);
    }
  }

  return depthStack[0];
}
 */

var arrUtil = {
  lastElement<T>(arr: T[]): T {
    return this.nthLastElement(arr, 0);
  },
  nthLastElement<T>(arr: T[], n: number): T {
    return arr[arr.length - n - 1];
  },
};

/* function treeNodeIsLeaf(node: TreeNode): node is TreeNodeLeaf {
  if (node.children.length > 0 && typeof node.children[0] === "string")
    return true;
  else return false;
} */

export interface TreeNode {
  title?: string;
  isGroupShow?: boolean;
  depth: number;
  children: (TreeNode | string)[];
}

/* interface TreeNodeInner extends TreeNodeGeneric {
  children: TreeNode[];
}
interface TreeNodeLeaf extends TreeNodeGeneric {
  children: string[];
}

type TreeNode = TreeNodeInner | TreeNodeLeaf; */

export type TreeBuilderArr = TreeComponent[];

type TreeComponent = MoveComponent | ContentComponent;

export type ContentComponent = {
  content: string;
};

type MoveComponent = HeaderMoveComponent | MoveOnlyComponent;

type HeaderMoveComponent = {
  upDown: number;
  header: string;
  isGroupShow: boolean;
};

type MoveOnlyComponent = {
  upDown: number;
};

function popN<T>(arr: T[], n: number) {
  for (let index = 0; index < n; index++) {
    arr.pop();
  }
}

function isHeaderMoveComponent(
  moveComponent: MoveComponent
): moveComponent is HeaderMoveComponent {
  return "header" in moveComponent;
}

function goDown(depthStack: TreeNode[], moveComponent: MoveComponent) {
  let newNode: TreeNode = {
    depth: depthStack[depthStack.length - 1].depth + 1,
    children: [],
  };
  if (isHeaderMoveComponent(moveComponent)) {
    newNode.title = moveComponent.header;
    newNode.isGroupShow = moveComponent.isGroupShow;
  }
  depthStack.push(newNode);
}

function goUpDown(depthStack: TreeNode[], moveComponent: MoveComponent) {
  if (moveComponent.upDown < 0) popN(depthStack, moveComponent.upDown);
  else if (moveComponent.upDown > 0) goDown(depthStack, moveComponent);
}

function isMoveComponent(
  treeComponent: TreeComponent
): treeComponent is MoveComponent {
  return treeComponent.hasOwnProperty("upDown");
}

export function buildTree(treeBuilderArr: TreeComponent[]): TreeNode {
  let topNode: TreeNode = { children: [], depth: 0 };
  let depthStack: TreeNode[] = [topNode];

  for (const treeBuilderElem of treeBuilderArr) {
    if (isMoveComponent(treeBuilderElem)) goUpDown(depthStack, treeBuilderElem);
    else {
      let topStackElement = arrUtil.lastElement(depthStack);
      topStackElement.children.push(treeBuilderElem.content);
    }
  }
  return topNode;
}
