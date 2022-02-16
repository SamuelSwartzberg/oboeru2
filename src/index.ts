import {
  parseClozeLikesToTree,
  replaceClozeLikes,
} from "./cloze-syntax-parser";

import { formatInlineLevel } from "./inline-formatting";

import { scrollClozeIntoView } from "./anki-card";

var container = document.querySelector(".container");
if (!container) throw new Error("No main container.");

var futureContainerHTML: string = container.innerHTML.trim();

futureContainerHTML = replaceParsedSectionsWithContent(
  parseToplevel(futureContainerHTML)
);
futureContainerHTML = formatInlineLevel(futureContainerHTML);
futureContainerHTML = replaceClozeLikes(
  parseClozeLikesToTree(futureContainerHTML),
  true
);

container.innerHTML = futureContainerHTML;

document.body.style.display = "block"; // finally, show everything

scrollClozeIntoView();
