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
  const section = document.createElement("section");
  section.classList.add("section");
  const sectionInnerSketchpad = document.createElement("div");
  sectionInnerSketchpad.classList.add(
    "section-inner",
    "section-inner-sketchpad"
  );
  sectionInnerSketchpad.appendChild(buildSizePicker(sectionInnerSketchpad));
  sectionInnerSketchpad.appendChild(buildCanvas());
  sectionInnerSketchpad.appendChild(buildColorPicker(sectionInnerSketchpad));
  section.appendChild(sectionInnerSketchpad);
  return section;
}

export function getClosestSketchpadSection(elem: HTMLElement): HTMLElement {
  const sectionInnerSketchpad = elem.closest(".section-inner-sketchpad");
  if (!(sectionInnerSketchpad && sectionInnerSketchpad instanceof HTMLElement))
    throw new Error("no parent sketchpad so cannot proceed");
  return sectionInnerSketchpad;
}
