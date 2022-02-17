import { parseClozeLikesToTree, replaceClozeLikes } from "./clozelike";

import { parseToplevel, replaceParsedSectionsWithContent } from "./container";

import { formatInlineLevel } from "./inline";

export function parseCard(futureContainerHTML: string): string {
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
