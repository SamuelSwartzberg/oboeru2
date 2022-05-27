import { getClassGroupShow } from "../../../../../globals";
import { LineSpecifier, Section } from "../types";
import { stringifyLine } from "./lines";
import {
  BlockElementState,
  emitHTMLClosingAllBlockElements,
} from "./lines/block-elements";

export function stringifySection(section: Section<LineSpecifier>): string {
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
  const sectionbody = stringifySectionOnly(subsectionbody);
  return sectionbody;
}

function stringifySubsection(linebody: string): string {
  return `<section class="sub-section">\n${linebody}\n</section>`;
}
function stringifySectionOnly(subsectionbody: string): string {
  return `<div class="section-inner section-inner-text">${subsectionbody}</div>`;
}
