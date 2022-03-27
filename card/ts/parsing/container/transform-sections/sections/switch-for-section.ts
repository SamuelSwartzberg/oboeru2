import { parseAsFlexContainer } from "./flex-container";
import { parseAsTable } from "./table";
import { parseAsTextSection } from "./text";

var sectionIndicatorsAndFunctions = {
  '<span class="cloze-dump">': dropSection,
  "table:": parseAsTable,
  "flex-container:": parseAsFlexContainer,
};

export function switchParseSection(rawHTMLText: string): string {
  if (rawHTMLText === "") return dropSection(rawHTMLText);
  const [rawHTMLTextWithoutGroupShow, isGroupShow] = getGroupShow(rawHTMLText);
  for (const [sectionIndicator, sectionFunction] of Object.entries(
    sectionIndicatorsAndFunctions
  )) {
    if (rawHTMLTextWithoutGroupShow.startsWith(sectionIndicator)) {
      return sectionFunction(
        rawHTMLTextWithoutGroupShow.slice(sectionIndicator.length),
        isGroupShow
      );
    }
  }
  return parseAsTextSection(rawHTMLText, isGroupShow);
}

function getGroupShow(rawHTMLText: string): [string, boolean] {
  let isGroupShow = false;
  if (rawHTMLText.startsWith("！")) {
    isGroupShow = true;
    rawHTMLText = rawHTMLText.slice(1);
  }
  return [rawHTMLText, isGroupShow];
}

function dropSection(rawHTMLText: string): string {
  return "";
}
