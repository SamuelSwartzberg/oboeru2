import { InnerSpecifier, ParsedSpecifer, SpanSpecifierInner } from ".";
import { Specifiers } from "../parse";

export function parseSpecifier<T>(
  specifier: Specifiers
): ParsedSpecifer<InnerSpecifier> {
  return {
    classes: specifier.class ? specifier.class.split(" ") : [],
    style: specifier.style ? specifier.style.split(" ") : [],
    individualSpecifiers: {
      headerrows: parseInt(specifier.headerrows, 10),
      span: parseSpanSpecifier(specifier.span),
      type: specifier.type,
    },
  };
}

function parseSpanSpecifier(spanSpecifier: string): SpanSpecifierInner {
  const [col, row] = spanSpecifier.split(",");
  let [colParsed, rowParsed] = [parseInt(col, 10), parseInt(row, 10)];
  if (Number.isNaN(colParsed)) colParsed = 1;
  if (Number.isNaN(rowParsed)) rowParsed = 1;
  return { col: colParsed, row: rowParsed };
}
