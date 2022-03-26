import log from "loglevel";
import { SpanSpecifierInner } from "../parse-specifier";

export function buildHTMLElement(
  tagName: string,
  attributes: { [key: string]: string },
  children: string[]
): string {
  log.debug("Building an HTML element with children...");
  log.debug(children);
  const attrString = Object.keys(attributes)
    .map((key) => `${key}="${attributes[key]}"`)
    .join(" ");
  const childrenString = children.join("\n");
  const resultantHTML = `<${tagName} ${attrString}>\n${childrenString}\n</${tagName}>`;

  log.debug(resultantHTML);
  return resultantHTML;
}

export function transformSpanSpecifierInnerToAttributes(
  spanSpecifier: SpanSpecifierInner = {
    col: 1,
    row: 1,
  }
): { colspan: string; rowspan: string } {
  return {
    colspan: String(spanSpecifier.col),
    rowspan: String(spanSpecifier.row),
  };
}
