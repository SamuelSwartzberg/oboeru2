export function clozelikeHTMLFromStringConstituents(
  content: string,
  classes: string,
  hintStylingDeclaration?: string
): string {
  return `<span class="is-cloze-scramble-or-hide ${classes}" ${
    classes.includes("c-active") ? hintStylingDeclaration : ""
  }>${content}</span>`;
}
