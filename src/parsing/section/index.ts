// TODO: Since <article>s are not nested, parent headings cannot be made visible when in children, except by making the whole group visible, which is nonsense. This needs to be fixed, probably by nesting

import { separateIntoSpecifiersAndNonspecifiers } from "../globals";

export function formatSectionLevel(rawHTMLText: string): string {
  let formattedHTML: string = "";
  let isGroupShow = false;
  if (rawHTMLText === "") {
    return "";
  }
  if (rawHTMLText.startsWith("！")) {
    isGroupShow = true;
    rawHTMLText = rawHTMLText.slice(1);
  }
  if (rawHTMLText.startsWith('<span class="cloze-dump">')) {
    return "";
  } else if (rawHTMLText.startsWith("table:")) {
    formattedHTML = parseAsTable(
      rawHTMLText.slice("table:".length),
      isGroupShow
    );
  } /* else if (rawHTMLText.startsWith("onion-box:")) {
    formattedHTML = parseAsOnionBox(
      rawHTMLText.slice("onion-box:".length),
      isGroupShow
    );
  }  */ else if (rawHTMLText.startsWith("flex-container:")) {
    formattedHTML = parseAsFlexContainer(
      rawHTMLText.slice("flex-container:".length),
      isGroupShow
    );
  } else {
    formattedHTML = parseIntoLinesOrLineLike(rawHTMLText, isGroupShow);
  }
  return formattedHTML;
}

function parseIntoLinesOrLineLike(rawHTMLText: string, isGroupShow: boolean) {
  let lineLikes: string = parseIntoLineLike(rawHTMLText);
  return `<section class="${
    !isGroupShow ? "cloze-group" : " "
  } section text-section">${lineLikes}</section>`;
}

// new parsing syntax, using markdown-like syntax but customized for cloze demands
// for any area between a markdown-like, #-begun heading
// anything delimited by a blank line becomes a section or a table, depending on if there's a table-beginning character
// all # headers become the same in HTML, but all sections/tables beneath them are indented to that level
// every normal line becomes a line that hides its contents if not clozed
// ! at the beginning of a thing escapes its hiding default behavor.
// a line begun with ^ becomes small
// subsequent lines beginning with > become blockquotes
// lines delimited with ``` become code blocks

function parseIntoLineLike(section: string): string {
  section = section.trim();
  section = section.replace(/^```(.*?)^```/ms, "<pre><code>$1</pre></code>");
  let subsections: string[] = section.split("\n\n");
  let newSection: string[] = [];
  for (let subsection of subsections) {
    let subsectionLines: string[] = subsection.split("\n");
    let newSubsectionLines: string[] = [];
    let currentlyBlockquote = false;
    for (let subsectionLine of subsectionLines) {
      let newSubsectionLine: string = subsectionLine.replace(
        /^(\^?)((?:&gt; )?)((?:- )?)((?:\d\. )?)(!?)(<[^>]+>)?(.*)$/g,
        (
          match,
          isSmall,
          isBlockquote,
          isUnorderedListItem,
          isOrderedListItem,
          isGroupShow,
          isBegunByHTMLTag,
          content
        ) => {
          if (isBegunByHTMLTag) return match;
          let newLine = "";

          // when we encounter a blockquote for the first time, we want to open the HTML tag. Once we're not in a line which is a blockquote anymore, we want to close the HTML tag.
          if (isBlockquote && !currentlyBlockquote) {
            newLine += "<blockquote>";
            currentlyBlockquote = true;
          } else if (!isBlockquote && currentlyBlockquote) {
            newLine += "</blockquote>";
            currentlyBlockquote = false;
          }

          let typeOfElement = {
            type: isUnorderedListItem || isOrderedListItem ? "li" : "span",
            classes: isOrderedListItem
              ? "ordered"
              : isUnorderedListItem
              ? "unordered"
              : "line",
          };

          newLine += `<${typeOfElement.type} class="${typeOfElement.classes} ${
            !isGroupShow ? "cloze-group" : " "
          }${isSmall ? " sub" : ""}">${content}</${typeOfElement.type}>`;
          return newLine;
        }
      );
      newSubsectionLines.push(newSubsectionLine);
    }
    if (currentlyBlockquote) {
      newSubsectionLines.push("</blockquote>");
    }
    let newSubsection = newSubsectionLines.join("\n");
    newSubsection = newSubsection.replace(/^(<li.*<\/li>)$/gms, "<ul>$1</ul>");
    newSection.push(newSubsection);
  }
  return newSection
    .map((subsection) => `<section class="sub-section">${subsection}</section>`)
    .join("\n");
}

// TODO: we only need to format the visible cloze groups on the front

type GenericSpecifier = {
  nonspecifier: string;
  class: string;
  style: string;
};

type TableSpecifier = {
  headerrows: string;
} & GenericSpecifier;

type CellSpecifier = {
  span: string;
  type: string;
} & GenericSpecifier;

function isCellSpecifier(specifier: Specifier): specifier is CellSpecifier {
  return specifier.hasOwnProperty("span");
}

type Specifier = CellSpecifier | TableSpecifier;

function parseSpecifiers<SomeSpec extends Specifier>(
  contents: string,
  approvedSpecifierObject: SomeSpec
): SomeSpec {
  let approvedSpecifierObjectKeys = Object.keys(approvedSpecifierObject);
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    function (specfier: string) {
      let [specifierKey, specifierValue] = specfier.split("=");
      if (approvedSpecifierObjectKeys.includes(specifierKey))
        return [specifierKey, specifierValue];
      else return undefined;
    }
  );
  approvedSpecifierObject["nonspecifier"] = nonspecifier;

  return specifiers as SomeSpec;
}
