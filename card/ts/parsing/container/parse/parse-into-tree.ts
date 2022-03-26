import { lastElement, nthLastElement } from "../../../globals/arr-util";
import { handleContentLine } from "./content-line";
import {
  countLeadingHashSigns,
  parseHeaderIntoFlagsAndContent,
} from "./header-line";

function changeTreeLevelWithElement(
  chainOfDepth: TreeNode<string>[],
  amount: number,
  newElement: TreeNodeSection<string>
): TreeNode<string>[] {
  (
    nthLastElement(chainOfDepth, -amount + 1) as TreeNodeSection<string>
  ).children.push(newElement);
  if (amount - 1 < 0) chainOfDepth = chainOfDepth.slice(0, amount - 1);
  chainOfDepth.push(newElement);
  return chainOfDepth;
}

function finishPreviouslyRecordingElement(
  chainOfDepth: TreeNode<string>[],
  contents: string[]
) {
  if (contents.length > 0) {
    lastElement(chainOfDepth).children.push(contents.join("\n"));
  }
}

export interface TreeNode<T> {
  children: (TreeNode<T> | T)[];
  type: "section" | "root";
}

export interface TreeNodeSection<T> extends TreeNode<T> {
  type: "section";
  title: string;
  depth: number;
  isGroupShowHeader: boolean;
}
export interface TreeNodeRoot<T> extends TreeNode<T> {
  type: "root";
}

export interface ParseState {
  contents: string[];
  lastHeaderDepth: number;
  lastLineWasNewline: boolean;
}

export function parseToplevel(rawHTML: string): TreeNode<string> {
  let unparsedLines: string[] = rawHTML.split("\n");
  let toplevel: TreeNodeRoot<string> = { children: [], type: "root" };
  let chainOfDepth: TreeNode<string>[] = [toplevel];
  let parseState: ParseState = {
    contents: [],
    lastHeaderDepth: 0,
    lastLineWasNewline: false,
  };

  for (const currentline of unparsedLines) {
    let amountOfLeadingHashSigns: number = countLeadingHashSigns(currentline);
    if (amountOfLeadingHashSigns > 0) {
      let [linecontent, isGroupShowHeader] = parseHeaderIntoFlagsAndContent(
        currentline,
        amountOfLeadingHashSigns
      );
      let amountTheNewHeadingIsDeeperOrHigherThanPreviousLevel: number =
        amountOfLeadingHashSigns - parseState.lastHeaderDepth; // 0 = same level; positive = deeper, negative = higher

      parseState.lastHeaderDepth = amountOfLeadingHashSigns;

      finishPreviouslyRecordingElement(chainOfDepth, parseState.contents);
      parseState.contents = [];

      let newElement: TreeNodeSection<string> = {
        children: [],
        type: "section",
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
      parseState = handleContentLine(currentline, parseState, chainOfDepth);
    }
  }
  lastElement(chainOfDepth).children.push(parseState.contents.join("\n"));
  return toplevel;
}
