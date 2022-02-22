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
  const sketchpadSectionSidebar = document.createElement("div");
  sketchpadSectionSidebar.classList.add("sketchpad-section__sidebar");
  sketchpadSectionSidebar.appendChild(buildSizePicker());
  sketchpadSection.appendChild(sketchpadSectionSidebar);
  sketchpadSection.appendChild(buildCanvas());
  sketchpadSection.appendChild(buildColorPicker());
  return sketchpadSection;
}
