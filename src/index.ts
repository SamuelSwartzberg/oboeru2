import { parseCard } from "./parsing";
import { formatTags, scrollClozeIntoView } from "./anki-card";
import { applyEventHandlers } from "./dom-event-manipulators";
import { setActiveGroups } from "./group-activation";

var container = document.querySelector(".container");
if (!container) throw new Error("No main container.");

formatTags();

container.innerHTML = parseCard(container.innerHTML.trim());

setActiveGroups();
applyEventHandlers();

document.body.style.display = "block"; // finally, show everything

scrollClozeIntoView();
