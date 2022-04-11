import { formatInlineLevel } from "../parsing/inline";

export function formatVisibleClozeGroups(templateTree: DocumentFragment) {
  templateTree
    .querySelectorAll(".container > .group-active")
    .forEach((group) => {
      group.innerHTML = formatInlineLevel(group.innerHTML);
    });
}
