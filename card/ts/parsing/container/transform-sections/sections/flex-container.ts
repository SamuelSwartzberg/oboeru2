import { getClassGroupShow } from "../../../globals";

export function parseAsFlexContainer(rawHTMLText: string) {
  return `<div class="section-inner section-inner-flex-container">${rawHTMLText}</div>`;
}
