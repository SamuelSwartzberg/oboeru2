import { getClassGroupShow } from "../../../../globals";
import { LineSpecifier, Section } from "./types";

interface BlockElementKeys {
  code: any;
  blockquote: any;
  listOrdered: any;
  listUnordered: any;
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
        listOrdered: false,
        listUnordered: false,
      };
      for (const line of subsection.lines) {
        lines.push(...stringifyLine(line, blockElementState));
      }
      lines.push(emitHTMLClosingAllBlockElements(blockElementState));
      const subsectionbody = stringifySubsection(lines.join("\n"));
      return subsectionbody;
    })
    .join("\n");
  const sectionbody = stringifySectionOnly(subsectionbody, isGroupShow);
  return sectionbody;
}

var blockElements: BlockElementElements = {
  blockquote: ["blockquote"],
  code: ["pre", "code"],
  listOrdered: ["ol"],
  listUnordered: ["ul"],
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

interface LineConstitutents {
  content: string;
  elementType: string;
  classes: string[];
}

function stringifyLine(
  line: LineSpecifier,
  blockElementState: BlockElementState
): string[] {
  const outputLines: string[] = [];
  const htmlForBlockState = emitHTMLForBlockState(line, blockElementState);
  if (htmlForBlockState) {
    outputLines.push(htmlForBlockState);
  }
  const lineConstituents = linePropertiesToLineConstituents(line);
  outputLines.push(lineConstituentsToString(lineConstituents));
  return outputLines;
}

function linePropertiesToLineConstituents(
  line: LineSpecifier
): LineConstitutents {
  const lineConstituents: LineConstitutents = {
    content: line.content,
    elementType: "span",
    classes: [],
  };
  if (line.properties["listOrdered"] || line.properties["listUnordered"]) {
    lineConstituents.elementType = "li";
  }
  if (line.properties["listOrdered"]) lineConstituents.classes.push("ordered");
  if (line.properties["listUnordered"])
    lineConstituents.classes.push("unordered");
  if (line.properties.small) lineConstituents.classes.push("sub");
  if (line.properties.groupShow)
    lineConstituents.classes.push(getClassGroupShow(true));
  return lineConstituents;
}

function lineConstituentsToString(lineConstituents: LineConstitutents): string {
  return `<${
    lineConstituents.elementType
  } class="${lineConstituents.classes.join(" ")}">${
    lineConstituents.content
  }</${lineConstituents.elementType}>`;
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
function emitHTMLClosingAllBlockElements(
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
