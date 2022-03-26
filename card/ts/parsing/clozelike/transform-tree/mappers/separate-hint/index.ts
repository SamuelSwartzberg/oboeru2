import log from "loglevel";
import { BooleanClozelike } from "../../../2-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { TreeElement } from "../../globals";

type Hint = {
  hint?: string;
};

export type WithHint = Hint & BooleanClozelike;

var HINT_SEPARATOR = "：";

function splitIntoContentAndHint(
  value: string
): [string, string] | [string, undefined] {
  let hint;
  let newValue;
  if (value.includes(HINT_SEPARATOR)) {
    hint = value.split(HINT_SEPARATOR).slice(-1)[0];
    newValue = value.split(HINT_SEPARATOR).slice(0, -1).join(HINT_SEPARATOR);
  } else newValue = value;
  return [newValue, hint];
}

export function separateHintTreeElement(
  treeElement: TreeElement<BooleanClozelike>
): TreeElement<WithHint> {
  log.debug("separateHintTreeElement was called to handle a tree element...");
  if (treeElement.contents.clozelike) {
    log.debug("...and it was 🟩  a clozelike");
    let hint;
    let newValue;
    if (typeof treeElement.value === "string") {
      [newValue, hint] = splitIntoContentAndHint(treeElement.value);
      treeElement.value = newValue;
    } else {
      [newValue, hint] = splitIntoContentAndHint(treeElement.value[1]);
      treeElement.value[1] = newValue;
    }
    const newTreeElement: TreeElement<WithHint> = {
      ...treeElement,
      contents: { clozelike: true },
    };
    if (hint) {
      newTreeElement.contents.hint = hint;
    }
    return newTreeElement;
  } else {
    log.debug("...but it was 🟨  not a clozelike");
    return { ...treeElement };
  }
}