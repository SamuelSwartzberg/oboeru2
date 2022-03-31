import log from "loglevel";
import { InnerSpecifier, ParsedSpecifer, SpanSpecifierInner } from ".";
import { Specifiers } from "../parse";

export function parseSpecifier(
  specifier: Specifiers
): ParsedSpecifer<InnerSpecifier> {
  log.debug("Parsing specifier:");
  log.debug(JSON.stringify(specifier, null, 2));
  const parsedSpecifier = {
    classes: parseClassOrStyle(specifier.class),
    style: parseClassOrStyle(specifier.style),
    individualSpecifiers: {} as InnerSpecifier,
  };
  if (specifier.headerrows) {
    parsedSpecifier.individualSpecifiers.headerrows = parseInt(
      specifier.headerrows,
      10
    );
  } else {
    parsedSpecifier.individualSpecifiers.headerrows = 1;
  }
  if (specifier.span) {
    parsedSpecifier.individualSpecifiers.span = parseSpanSpecifier(
      specifier.span
    );
  }
  if (specifier.type) {
    parsedSpecifier.individualSpecifiers.type = specifier.type;
  }

  return parsedSpecifier;
}

function parseClassOrStyle(str?: string): string[] {
  if (str && str.length > 0) return str.split("§");
  else return [];
}

function parseSpanSpecifier(spanSpecifier: string): SpanSpecifierInner {
  const [col, row] = spanSpecifier.split(",");
  let [colParsed, rowParsed] = [parseInt(col, 10), parseInt(row, 10)];
  if (Number.isNaN(colParsed)) colParsed = 1;
  if (Number.isNaN(rowParsed)) rowParsed = 1;
  return { col: colParsed, row: rowParsed };
}
