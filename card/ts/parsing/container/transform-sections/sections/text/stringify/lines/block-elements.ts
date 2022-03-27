import log from "loglevel";
import { LineSpecifier } from "../../types";

export function emitHTMLClosingAllBlockElements(
  blockElementState: BlockElementState
): string {
  let output = "";
  for (const elementType in blockElementState) {
    if (blockElementState[elementType as keyof BlockElementState]) {
      output += getHTMLForElementName(
        blockElements[elementType as keyof BlockElementElements],
        true
      );
    }
  }
  return output;
}

export interface BlockElementKeys {
  code: any;
  blockquote: any;
  listOrdered: any;
  listUnordered: any;
}

export type BlockElementState = {
  [key in keyof BlockElementKeys]: boolean;
};

export type BlockElementElements = {
  [key in keyof BlockElementKeys]: string[];
};

export var blockElements: BlockElementElements = {
  blockquote: ["blockquote"],
  code: ["pre", "code"],
  listOrdered: ["ol"],
  listUnordered: ["ul"],
};

export function getHTMLForElementName(
  elementNames: string[],
  isClosing: boolean = false
): string {
  let htmlElementNames = elementNames.map(
    (elementName) => `<${isClosing ? "/" : ""}${elementName}>`
  );
  if (isClosing) {
    htmlElementNames = htmlElementNames.reverse();
  }
  return htmlElementNames.join("");
}

export function emitHTMLForBlockState(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string | undefined {
  log.debug(
    "Handling block elements, where the current block element state and the line are: "
  );
  log.debug(`${JSON.stringify(blockElementState)}`);
  log.debug(`${JSON.stringify(line)}`);
  for (const elementType in blockElements) {
    if (
      line.properties[elementType as keyof LineSpecifier["properties"]] &&
      !blockElementState[elementType as keyof BlockElementState]
    ) {
      blockElementState[elementType as keyof BlockElementState] = true;
      return getHTMLForElementName(
        blockElements[elementType as keyof BlockElementElements]
      );
    } else if (
      !line.properties[elementType as keyof LineSpecifier["properties"]] &&
      blockElementState[elementType as keyof BlockElementState]
    ) {
      blockElementState[elementType as keyof BlockElementState] = false;
      return getHTMLForElementName(
        blockElements[elementType as keyof BlockElementElements],
        true
      );
    }
  }
}
