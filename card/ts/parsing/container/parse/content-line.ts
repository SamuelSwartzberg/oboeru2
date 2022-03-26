import { lastElement } from "../../../globals/arr-util";
import { ParseState, TreeNode } from "./parse-into-tree";

export function handleContentLine(
  contentLine: string,
  parseState: ParseState,
  chainOfDepth: TreeNode<string>[]
): ParseState {
  if (contentLine.length === 0) {
    if (parseState.lastLineWasNewline) {
      lastElement(chainOfDepth).children.push(parseState.contents.join("\n"));
      parseState.contents = [];
      parseState.lastLineWasNewline = false;
    } else {
      parseState.lastLineWasNewline = true;
    }
  } else {
    parseState.lastLineWasNewline = false;
    parseState.contents.push(contentLine);
  }
  return parseState;
}
