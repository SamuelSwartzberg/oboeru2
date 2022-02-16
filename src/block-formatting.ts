// TODO: Since <article>s are not nested, parent headings cannot be made visible when in children, except by making the whole group visible, which is nonsense. This needs to be fixed, probably by nesting

function formatSectionLevel(rawHTMLText: string): string {
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

function parseAsTable(rawHTMLText: string, isGroupShow: boolean) {
  let tableSpec = parseSpecifiers(rawHTMLText, {
    nonspecifier: "",
    class: "",
    style: "",
    headerrows: "1",
  } as TableSpecifier);
  let headerrows: number = parseInt(tableSpec.headerrows, 10);
  if (isNaN(headerrows)) {
    headerrows = 1;
  }
  let rows: string[] = tableSpec.nonspecifier.split("\n");
  let [header, body] = [
    parseListOfRows(rows.slice(0, headerrows), "th").join("\n"),
    parseListOfRows(rows.slice(headerrows), "td").join("\n"),
  ];
  return `<table class="${!isGroupShow ? "cloze-group " : ""}${
    tableSpec.class
  } section" style="${
    tableSpec.style
  }"><thead>${header}</thead><tbody>${body}</tbody></table>`;
}

function parseListOfRows(
  listOfRows: string[],
  cellType: "th" | "td"
): string[] {
  return listOfRows.map((row) => parseRow(row, cellType));
}

function parseRow(row: string, cellType: "th" | "td"): string {
  let isGroupShow: boolean = false;
  if (row.startsWith("!")) {
    isGroupShow = true;
    row = row.slice(1);
  }
  return `<tr class="${!isGroupShow ? "cloze-group" : ""}">${row
    .split("|")
    .map((cell) => surroundCellByCellHTML(cell, cellType))
    .join("")}</tr>`;
}

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

function surroundCellByCellHTML(cellContents: string, cellType: "th" | "td") {
  let _;
  let tableSpecs = parseSpecifiers(cellContents, {
    nonspecifier: "",
    class: "",
    style: "",
    span: "",
    type: cellType,
  } as CellSpecifier);
  let span = tableSpecs.span.split(",");
  span.push("1", "1"); // default values for span, will be ignored if there are enough already
  let parsedSpan = span.map((spanSpec: string) => {
    let parsedSpanSpec = parseInt(spanSpec, 10);
    return Number.isNaN(parsedSpanSpec) ? 1 : parsedSpanSpec;
  });
  return `<${tableSpecs.type} colspan="${parsedSpan}" rowspan="${parsedSpan}" class="${tableSpecs.class}" style="${tableSpecs.style}">${tableSpecs.nonspecifier}</${tableSpecs.type}>`;
}
/* 
function parseAsOnionBox(
  unparsedOnionBoxString: string,
  isGroupShow: boolean
): string {
  let onionBoxStructure = parseOnionBoxStructure(unparsedOnionBoxString);
  return `<section class="${
    !isGroupShow ? "cloze-group" : " "
  } section">${formatOnionBox(onionBoxStructure)}</section>`;
}

function formatOnionBox(onionBoxStructure) {
  let returnString = "";
  for (let [key, value] of Object.entries(onionBoxStructure)) {
    if (value === "leaf") {
      returnString += `<div class="onion-box"><span>${key}</span></div>`;
    } else {
      returnString += `<div class="onion-box"><span>${key}</span>${formatOnionBox(
        value
      )}</div>`;
    }
  }
  return returnString;
}

function parseOnionBoxStructure(unparsedOnionBoxString: string) {
  // an onion box is a nested box that uses labeled bracket notation to describe its layout
  let onionBox = {};
  let unparsedChildrenCharArray = [...unparsedOnionBoxString];
  let chainOfDepth = [];
  let label = "";
  let readingLabel = false;
  let currentLevel = onionBox;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === "[") {
      label = "";
      readingLabel = true; // if we hit an open bracket, we need to start reading the label, any other actions can wait until we've read the label
    } else if (currentChar === "]") {
      if (readingLabel === true) {
        readingLabel = false;
        currentLevel[label] = "leaf";
        chainOfDepth.push(currentLevel);
      }
      chainOfDepth.pop();
      currentLevel = chainOfDepth[chainOfDepth.length - 1];
    } else if (currentChar === " ") {
      // once we hit a space, we've finished reading the label, and we know there will be children
      readingLabel = false;
      // since we know there will be children, we need to prepare a new object, make that the current object and add it to the reference chain, and make the previous current object refer to the new object
      let newLevel = {};
      currentLevel[label] = newLevel;
      currentLevel = newLevel;
      chainOfDepth.push(currentLevel);
    } else if (readingLabel) {
      label += currentChar;
    }
  }
  return onionBox;
} */

function parseAsFlexContainer(rawHTMLText: string, isGroupShow: boolean) {
  return `<div class="flex-container ${
    !isGroupShow ? "cloze-group" : " "
  } section">${rawHTMLText}</div>`;
}
