var HINT_SEPARATOR = "：";

export function splitIntoContentAndHint(clozeLike: string): {
  content: string;
  hint?: string;
} {
  let [content, ...possiblyHint] = clozeLike.split(HINT_SEPARATOR);
  let hint = Array.isArray(possiblyHint)
    ? possiblyHint.join(HINT_SEPARATOR)
    : undefined;
  return { content, hint };
}
