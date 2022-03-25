import { parseCard } from "./parsing";
import { formatTags, scrollClozeIntoView } from "./anki-card";
import { applyEventHandlers } from "./dom-event-manipulators";
import { setActiveGroups } from "./group-activation";
import { decoratePostBuild } from "./post-build";
import log from "loglevel";

var container = document.querySelector(".container");
if (!container) throw new Error("No main container.");

log.setLevel("info");
log.info("Log active.");

formatTags();

container.innerHTML = parseCard(container.innerHTML.trim());

setActiveGroups();
decoratePostBuild();
applyEventHandlers();

document.body.style.display = "block"; // finally, show everything

scrollClozeIntoView();
