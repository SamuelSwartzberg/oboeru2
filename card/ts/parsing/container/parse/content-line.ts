import { lastElement } from "../../../globals/arr-util";
import { TreeNode } from "../tree-node";
import {
  finishPreviouslyRecordingElement,
  ParseState,
} from "./parse-into-tree";

export function handleContentLine(
  contentLine: string,
  parseState: ParseState,
  chainOfDepth: TreeNode<string>[]
): ParseState {
  if (contentLine.length === 0) {
    if (parseState.lastLineWasNewline) {
      finishPreviouslyRecordingElement(chainOfDepth, parseState.contents);
      parseState.contents = [];
      parseState.lastLineWasNewline = false;
    } else {
      parseState.lastLineWasNewline = true;
      parseState.contents.push("");
    }
  } else {
    parseState.lastLineWasNewline = false;
    parseState.contents.push(contentLine);
  }
  return parseState;
}
