import { parseAsTable } from "./sections/table";

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
    formattedHTML = parseAsTextSection(rawHTMLText, isGroupShow);
  }
  return formattedHTML;
}

// TODO: we only need to format the visible cloze groups on the front
