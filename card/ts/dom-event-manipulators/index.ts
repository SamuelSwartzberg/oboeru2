import { applyClickHandlers } from "./click-handlers";
import { createClickableElements } from "./handlers-with-dom-manipulation-beforehand";
import { applyKeyHandlers } from "./keyevent-handlers";

export function applyEventHandlers(templateTree: DocumentFragment): void {
  applyClickHandlers(templateTree);
  applyKeyHandlers(); // no need for templateTree, since key handlers are applied to the whole document
  createClickableElements(templateTree);
}
