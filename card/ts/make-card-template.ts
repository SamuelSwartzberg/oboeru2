import { applyEventHandlers } from "./dom-event-manipulators";
import { setActiveGroups } from "./group-activation";
import { decoratePostBuild } from "./post-build";

export function makeCardTemplate(
  tempContainer: HTMLTemplateElement,
  textContent: string
): DocumentFragment {
  tempContainer.innerHTML = textContent;

  setActiveGroups(tempContainer.content);
  decoratePostBuild(tempContainer.content);
  applyEventHandlers(tempContainer.content);
  return tempContainer.content;
}
