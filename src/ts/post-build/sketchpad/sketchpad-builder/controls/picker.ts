import { Stroke } from "../stroke";

export function buildPicker(type: string): HTMLDivElement {
  const picker = document.createElement("div");
  picker.classList.add(`${type}-picker`);
  for (const color of Stroke.getPossibleColors()) {
    picker.appendChild(buildIndividualPicker(color, type));
  }
  return picker;
}

function buildIndividualPicker(color: string, type: string): HTMLDivElement {
  const colorPickerColor = document.createElement("div");
  colorPickerColor.classList.add(
    `${type}-picker__${type}`,
    `${type}-picker__${type}--` + color
  );
  colorPickerColor.addEventListener("click", setNew);
  return colorPickerColor;
}

function setNew(e: Event) {
  const target = e.target;
  if (target instanceof HTMLElement) {
    const parentSketchpadSection = target.closest(".sketchpad-section");
    if (parentSketchpadSection instanceof HTMLElement) {
      const [_, type, value] = target.classList[1].match(
        /^.+?-picker__(.+)--(.+)$/
      ) as [string, string, string];
      parentSketchpadSection.dataset[type] = value;
    }
  } else
    throw new Error("Target is not a HTML Element, so cannot be a picker.");
}
