import { parseCard } from "./parsing";
import { getTags, initBackness, scrollClozeIntoView } from "./anki-card";
import { applyEventHandlers } from "./dom-event-manipulators";
import { setActiveGroups } from "./group-activation";
import { decoratePostBuild } from "./post-build";
import log from "loglevel";

window.setTimeout(() => {
  const rawContentContainer = document.getElementById("raw-content");
  if (!rawContentContainer) throw new Error("No text content.");
  const rawTagsContainer = document.getElementById("raw-tags");
  if (!rawTagsContainer) throw new Error("No tags.");
  const parsedContainer = document.getElementById("parsed-container");
  if (!parsedContainer || !(parsedContainer instanceof HTMLTemplateElement))
    throw new Error("No container for parsed elements.");

  log.setLevel("info");
  log.info("Log active.");
  initBackness();

  let extraInfoButtonSection = '<div class="extra-info-button-section"></div>';
  let tags = `<h1 id="tag-container">${getTags(
    rawTagsContainer.innerHTML.trim()
  )}</h1>`;
  let container = `<div class="container">${parseCard(
    rawContentContainer.innerHTML.trim()
  )}</div>`;
  let cardHTML = `${extraInfoButtonSection}${tags}${container}`;
  parsedContainer.innerHTML = cardHTML;

  setActiveGroups(parsedContainer.content);
  decoratePostBuild(parsedContainer.content);
  applyEventHandlers(parsedContainer.content);

  let ankiContainer = document.getElementById("qa");
  if (!ankiContainer) throw new Error("No anki container.");

  ankiContainer.appendChild(parsedContainer.content);

  window.setTimeout(scrollClozeIntoView, 100);
}, 0);
