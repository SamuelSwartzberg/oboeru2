import { buildTree, TreeBuilderArr, TreeNode } from "../parse-to-tree";

function countLeadingHashSigns(line: string): number {
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== "#") return i;
  }
  return 0;
}

var arrUtil = {
  lastElement<T>(arr: T[]): T {
    return this.nthLastElement(arr, 0);
  },
  nthLastElement<T>(arr: T[], n: number): T {
    return arr[arr.length - n - 1];
  },
};

function parseHeaderIntoFlagsAndContent(
  line: string,
  amountOfLeadingHashSigns: number
): [string, boolean] {
  line = line.slice(amountOfLeadingHashSigns);
  let isGroupShowHeader = false;
  if (line.startsWith(" !")) {
    isGroupShowHeader = true;
    line = line.slice(2);
  }
  return [line.trim(), isGroupShowHeader];
}

function changeTreeLevelWithElement(
  chainOfDepth: treeNode[],
  amount: number,
  newElement: treeNodeGeneric
): treeNode[] {
  (
    arrUtil.nthLastElement(chainOfDepth, -amount + 1) as treeNodeGeneric
  ).children.push(newElement);
  if (amount - 1 < 0) chainOfDepth = chainOfDepth.slice(0, amount - 1);
  chainOfDepth.push(newElement);
  return chainOfDepth;
}

function finishAndEmptyPreviouslyRecordingElement(
  chainOfDepth: treeNode[],
  contents: string[]
): string[] {
  if (contents.length > 0) {
    (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
      title: "section",
      children: contents,
    });
  }
  return [];
}

export type treeNodeGeneric = {
  children: treeNode[];
  title: string;
  depth: number;
  isGroupShowHeader: boolean;
};
export type treeNodeRoot = { children: treeNode[]; title: "root" };
export type treeNodeLeaf = { children: string[]; title: "section" };
export type treeNode = treeNodeRoot | treeNodeGeneric | treeNodeLeaf;

export function parseToplevel(rawHTML: string): treeNode {
  let unparsedLines: string[] = rawHTML.split("\n");
  let toplevel: treeNode = { children: [], title: "root" };
  let chainOfDepth: treeNode[] = [toplevel];
  let contents: string[] = [];
  let lastLineWasNewline: boolean = false;
  let lastHeaderDepth: number = 0;

  for (const currentline of unparsedLines) {
    let amountOfLeadingHashSigns: number = countLeadingHashSigns(currentline);
    if (amountOfLeadingHashSigns > 0) {
      let [linecontent, isGroupShowHeader] = parseHeaderIntoFlagsAndContent(
        currentline,
        amountOfLeadingHashSigns
      );
      let amountTheNewHeadingIsDeeperOrHigherThanPreviousLevel: number =
        amountOfLeadingHashSigns - lastHeaderDepth; // 0 = same level; positive = deeper, negative = higher

      lastHeaderDepth = amountOfLeadingHashSigns;

      contents = finishAndEmptyPreviouslyRecordingElement(
        chainOfDepth,
        contents
      );

      let newElement: treeNodeGeneric = {
        children: [],
        title: linecontent,
        depth: amountOfLeadingHashSigns,
        isGroupShowHeader: isGroupShowHeader,
      };

      chainOfDepth = changeTreeLevelWithElement(
        chainOfDepth,
        amountTheNewHeadingIsDeeperOrHigherThanPreviousLevel,
        newElement
      );
    } else {
      if (currentline.length === 0) {
        if (lastLineWasNewline) {
          (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
            title: "section",
            children: contents,
          });
          contents = [];
          lastLineWasNewline = false;
        } else {
          lastLineWasNewline = true;
        }
      } else {
        lastLineWasNewline = false;
        contents.push(currentline);
      }
    }
  }
  (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
    title: "section",
    children: contents,
  });
  return toplevel;
}

function containerSectionStringToTreeComponentArray(
  inputStr: string
): TreeBuilderArr {
  let parts = inputStr
    .trim()
    .split("\n\n\n")
    .flatMap((sectionsWithInterspersedContainers) => {
      let headerOrSubsections =
        sectionsWithInterspersedContainers.split("\n\n");
      let outArr = [];
      let acc: string[] = [];
      for (const headerOrSubsection of headerOrSubsections) {
        if (headerOrSubsection.startsWith("#")) {
          if (acc.length > 0) {
            outArr.push(acc.join("\n\n"));
            acc = [];
          }
          outArr.push(headerOrSubsection);
        } else acc.push(headerOrSubsection);
      }
      if (acc.length > 0) outArr.push(acc.join("\n\n"));
      return outArr;
    });
  let treeComponents: TreeBuilderArr = [];
  let prevAmountLeadingHashSigns = 0;
  for (const part of parts) {
    let amountLeadingHashSigns: number = countLeadingHashSigns(part);
    if (amountLeadingHashSigns > 0) {
      let [header, isGroupShow] = parseHeaderIntoFlagsAndContent(
        part,
        amountLeadingHashSigns
      );
      treeComponents.push({
        header: header,
        isGroupShow: isGroupShow,
        upDown: amountLeadingHashSigns - prevAmountLeadingHashSigns,
      });
      prevAmountLeadingHashSigns = amountLeadingHashSigns;
    } else treeComponents.push({ content: part });
  }
  return treeComponents;
}

function parseToplevel2(html: string): TreeNode {
  return buildTree(containerSectionStringToTreeComponentArray(html));
}
