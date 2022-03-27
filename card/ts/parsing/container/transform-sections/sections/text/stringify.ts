import { getClassGroupShow } from "../../../../globals";
import { LineSpecifier, Section } from "./types";

interface BlockElementKeys {
  code: any;
  blockquote: any;
  "list-ordered": any;
  "list-unordered": any;
}

type BlockElementState = {
  [key in keyof BlockElementKeys]: boolean;
};

type BlockElementElements = {
  [key in keyof BlockElementKeys]: string[];
};

export function stringifySection(
  section: Section<LineSpecifier>,
  isGroupShow: boolean
): string {
  const subsectionbody = section.subsections
    .map((subsection) => {
      const lines: string[] = [];
      const blockElementState: BlockElementState = {
        code: false,
        blockquote: false,
        "list-ordered": false,
        "list-unordered": false,
      };
      for (const line of subsection.lines) {
        lines.push(...stringifyLine(line, blockElementState));
      }
      const subsectionbody = stringifySubsection(linebody);
      return subsectionbody;
    })
    .join("\n");
  const sectionbody = stringifySectionOnly(subsectionbody, isGroupShow);
  return sectionbody;
}

var blockElements: BlockElementElements = {
  blockquote: ["blockquote"],
  code: ["pre", "code"],
  "list-ordered": ["ol"],
  "list-unordered": ["ul"],
};

function getHTMLForElementName(
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

function emitHTMLForBlockState(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string | undefined {
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

interface LineConstitutents {}

function stringifyLine(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string[] {
  const outputLines: string[] = [];
  const htmlForBlockState = emitHTMLForBlockState(line, blockElementState);
  if (htmlForBlockState) {
    outputLines.push(htmlForBlockState);
  }
}
function stringifySubsection(linebody: string): string {
  return `<section class="sub-section">\n${linebody}\n</section>`;
}
function stringifySectionOnly(
  subsectionbody: string,
  isGroupShow: boolean
): string {
  return `<section class="${!getClassGroupShow(
    isGroupShow
  )} section text-section">${subsectionbody}</section>`;
}
