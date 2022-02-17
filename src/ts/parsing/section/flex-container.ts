export function parseAsFlexContainer(
  rawHTMLText: string,
  isGroupShow: boolean
) {
  return `<div class="flex-container ${
    !isGroupShow ? "cloze-group" : " "
  } section">${rawHTMLText}</div>`;
}
