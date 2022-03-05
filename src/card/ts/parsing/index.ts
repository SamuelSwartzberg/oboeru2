import { isFront } from "../anki-card";
import { parseClozelikes } from "./clozelike";
import { parseStructure } from "./container";

import { formatInlineLevel } from "./inline";
import { preformatHTML } from "./preformat";

export function parseCard(futureContainerHTML: string): string {
  futureContainerHTML = preformatHTML(futureContainerHTML);
  futureContainerHTML = parseStructure(futureContainerHTML);
  if (!isFront()) futureContainerHTML = formatInlineLevel(futureContainerHTML);
  futureContainerHTML = parseClozelikes(futureContainerHTML);
  return futureContainerHTML;
}
