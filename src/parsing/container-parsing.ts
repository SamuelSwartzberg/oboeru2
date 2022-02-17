import { formatSectionLevel } from "./section-parsing";

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

type treeNodeGeneric = {
  children: treeNode[];
  title: string;
  depth: number;
  isGroupShowHeader: boolean;
};
type treeNodeRoot = { children: treeNode[]; title: "root" };
type treeNodeLeaf = { children: string[]; title: "section" };
type treeNode = treeNodeRoot | treeNodeGeneric | treeNodeLeaf;

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

export function replaceParsedSectionsWithContent(
  parsedSections: treeNode
): string {
  if (parsedSections.children.length === 0) {
    return "";
  } else if (parsedSections.title === "section") {
    return formatSectionLevel(
      (parsedSections as treeNodeLeaf).children
        .map((line: string) => line.trim())
        .join("\n")
    ); // we know that this is treeNodeLeaf because of the check, but have no way of expressing that in TS in the types
  } else {
    // we know that this is treeNodeGeneric because of the check, but have no way of expressing that in TS in the types
    let newHeader = `<h2 class="${
      !(parsedSections as treeNodeGeneric).isGroupShowHeader
        ? "cloze-group"
        : " "
    }">${parsedSections.title}</h2>`;
    let newContent = (parsedSections as treeNodeGeneric).children
      .map(replaceParsedSectionsWithContent)
      .join("\n");
    if ((parsedSections as treeNodeGeneric).title === "root") return newContent;
    else
      return `<article class="indent-${
        (parsedSections as treeNodeGeneric).depth - 1
      } headered-container cloze-group">${newHeader}${newContent}</article>`;
  }
}
