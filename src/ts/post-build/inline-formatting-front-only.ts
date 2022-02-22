import { formatInlineLevel } from "../parsing/inline";

export function formatVisibleClozeGroups() {
  document.querySelectorAll(".container > .group-active").forEach((group) => {
    group.innerHTML = formatInlineLevel(group.innerHTML);
  });
}
