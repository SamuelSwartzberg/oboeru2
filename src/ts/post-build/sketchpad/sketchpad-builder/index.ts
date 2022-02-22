import { buildColorPicker } from "./controls/color-picker";
import colorPickerSvg from "./controls/color-picker-toggle.svg";
import { buildSizePicker } from "./controls/size-picker";

export function addSketchpad(nearestSection: Element) {
  throw new Error("Function not implemented.");
}

export function buildSketchpad(): void {
  const sketchpadSection = document.createElement("section");
  sketchpadSection.classList.add("section", "sketchpad-section");
  const sketchpadSectionSidebar = document.createElement("div");
  sketchpadSectionSidebar.classList.add("sketchpad-section__sidebar");
  const colorPickerToggle = document.createElement("div");
  colorPickerToggle.classList.add("color-picker-toggle");
  colorPickerToggle.innerHTML = colorPickerSvg;
  sketchpadSectionSidebar.appendChild(colorPickerToggle);
  sketchpadSectionSidebar.appendChild(buildSizePicker());
  sketchpadSection.appendChild(sketchpadSectionSidebar);
  sketchpadSection.appendChild(buildColorPicker());
}
