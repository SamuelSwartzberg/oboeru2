import { buildCanvas } from "./canvas";
import { buildColorPicker } from "./controls/color-picker";
import { buildSizePicker } from "./controls/size-picker";

export function addSketchpad(nearestSection: Element) {
  if (!nearestSection.parentElement)
    throw new Error(
      "section we wanted to add the sketchpad to doesn't have a parent, which is odd."
    );
  nearestSection.parentElement.appendChild(buildSketchpad());
}

export function buildSketchpad(): HTMLElement {
  const sketchpadSection = document.createElement("section");
  sketchpadSection.classList.add("section", "sketchpad-section");
  sketchpadSection.appendChild(buildSizePicker(sketchpadSection));
  sketchpadSection.appendChild(buildCanvas());
  sketchpadSection.appendChild(buildColorPicker(sketchpadSection));
  return sketchpadSection;
}

export function getClosestSketchpadSection(elem: HTMLElement): HTMLElement {
  const sketchpadSection = elem.closest(".sketchpad-section");
  if (!(sketchpadSection && sketchpadSection instanceof HTMLElement))
    throw new Error("no parent sketchpad so cannot proceed");
  return sketchpadSection;
}