import { parseCard } from "./parsing";
import { getTags } from "./anki-card";

export function makeCard({
  rawTags,
  rawContent,
}: {
  rawTags: string;
  rawContent: string;
}): string {
  let extraInfoButtonSection = '<div class="extra-info-button-section"></div>';
  let tags = `<h1 id="tag-container">${getTags(rawTags)}</h1>`;
  let container = `<div class="container">${parseCard(rawContent)}</div>`;
  let cardHTML = `${extraInfoButtonSection}${tags}${container}`;
  return cardHTML;
}
