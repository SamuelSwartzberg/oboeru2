import { getClassGroupShow } from "../../../globals";

export function parseAsFlexContainer(
  rawHTMLText: string,
  isGroupShow: boolean
) {
  return `<div class="flex-container ${getClassGroupShow(
    isGroupShow
  )} section">${rawHTMLText}</div>`;
}
