import { Stroke } from "../stroke";

export function buildPicker(type: string): HTMLDivElement {
  if (type !== "color" && type !== "size")
    throw new Error("Picker type must be color or size.");
  const picker = document.createElement("div");
  picker.classList.add(`${type}-picker`);
  picker.dataset[type] = Stroke.getInitialValueName(type);
  for (const color of Stroke.getPossibleColors()) {
    picker.appendChild(buildIndividualPicker(color, type));
  }
  return picker;
}

function buildIndividualPicker(value: string, type: string): HTMLDivElement {
  const pickerItem = document.createElement("div");
  pickerItem.classList.add(
    `${type}-picker__${type}`,
    `${type}-picker__${type}--` + value
  );
  pickerItem.style.setProperty(`--${type}`, value);
  pickerItem.addEventListener("click", setNew);
  return pickerItem;
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
