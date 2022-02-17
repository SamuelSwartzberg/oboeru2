import {
  parseClozeLikesToTree,
  replaceClozeLikes,
} from "./cloze-syntax-parser";

import {
  parseToplevel,
  replaceParsedSectionsWithContent,
} from "./container-parsing";

import { formatInlineLevel } from "./inline-parsing";

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
