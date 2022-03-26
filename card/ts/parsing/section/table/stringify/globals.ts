import { SpanSpecifierInner } from "../parse-specifier";

export function buildHTMLElement(
  tagName: string,
  attributes: { [key: string]: string },
  children: string[]
): string {
  const attrString = Object.keys(attributes)
    .map((key) => `${key}="${attributes[key]}"`)
    .join(" ");
  const childrenString = children.join("");
  return `<${tagName} ${attrString}>${childrenString}</${tagName}>`;
}

export function transformSpanSpecifierInnerToAttributes(
  spanSpecifier: SpanSpecifierInner
): { colspan: string; rowspan: string } {
  return {
    colspan: String(spanSpecifier.col),
    rowspan: String(spanSpecifier.row),
  };
}
