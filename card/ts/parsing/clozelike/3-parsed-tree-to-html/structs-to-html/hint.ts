export function getHintStyleDeclarationIfAny(hint?: string): string {
  if (hint && hint.length > 0) {
    return `style='--content-when-active: "${hint}"'`;
  } else return "";
}
