import log from "loglevel";
import { isFront } from "../anki-card";
import { parseClozelikes } from "./clozelike";
import { parseStructure } from "./container";

import { formatInlineLevel } from "./inline";
import { preformatHTML } from "./preformat";

export function parseCard(futureContainerHTML: string): string {
  const containerHTML = preformatHTML(futureContainerHTML);
  if (containerHTML === futureContainerHTML)
    log.info(
      "No preformatting applied. This is not necessarily a problem, since preformatting currently only consists of replacing ¶ with <br>."
    );
  const structuredHTML = parseStructure(containerHTML);
  if (containerHTML === structuredHTML)
    throw new Error(
      "The tree-parsed and structured HTML is the same as the original HTML. This should be impossible."
    );
  let inlineFormattedHTML;
  if (!isFront()) {
    // only on back since on front we only need to format visible groups.
    inlineFormattedHTML = formatInlineLevel(structuredHTML);
    if (inlineFormattedHTML === structuredHTML)
      log.warn(
        "Were on back, and no inline formatting was applied. This is odd, as this means there was no inline formatting on the whole card, which should be very rare or perhaps even never happen."
      );
  } else inlineFormattedHTML = structuredHTML;
  const clozeLikesParsedHTML = parseClozelikes(inlineFormattedHTML);
  if (inlineFormattedHTML === clozeLikesParsedHTML)
    throw new Error(
      "The cloze-like parsing did not change the HTML. This would mean there are no clozelikes, and therefore should be impossible."
    );
  return clozeLikesParsedHTML;
}
