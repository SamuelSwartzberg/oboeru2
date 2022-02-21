import { parseClozeLikesToTree, replaceClozeLikes } from "./clozelike";

import { parseToplevel, replaceParsedSectionsWithContent } from "./container";

import { formatInlineLevel } from "./inline";
import { preformatHTML } from "./preformat";

export function parseCard(futureContainerHTML: string): string {
  futureContainerHTML = preformatHTML(futureContainerHTML);
  futureContainerHTML = replaceParsedSectionsWithContent(
    parseToplevel(futureContainerHTML)
  );
  futureContainerHTML = formatInlineLevel(futureContainerHTML);
  futureContainerHTML = replaceClozeLikes(
    parseClozeLikesToTree(futureContainerHTML),
    true
  );
  return futureContainerHTML;
}
