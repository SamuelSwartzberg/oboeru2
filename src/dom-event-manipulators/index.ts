import { applyClickHandlers } from "./dom-event-manipulators/click-handlers";
import { createClickableElements } from "./dom-event-manipulators/handlers-with-dom-manipulation-beforehand";
import { applyKeyHandlers } from "./dom-event-manipulators/keyevent-handlers";

export function applyEventHandlers(): void {
  applyClickHandlers();
  applyKeyHandlers();
  createClickableElements();
}
