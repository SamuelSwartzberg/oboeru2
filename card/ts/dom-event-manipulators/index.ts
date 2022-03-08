import { applyClickHandlers } from "./click-handlers";
import { createClickableElements } from "./handlers-with-dom-manipulation-beforehand";
import { applyKeyHandlers } from "./keyevent-handlers";

export function applyEventHandlers(): void {
  applyClickHandlers();
  applyKeyHandlers();
  createClickableElements();
}
