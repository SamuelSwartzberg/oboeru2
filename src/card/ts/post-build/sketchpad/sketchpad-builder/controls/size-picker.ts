import { buildPicker } from "./picker";

export function buildSizePicker(sketchpadSection: HTMLElement): HTMLDivElement {
  return buildPicker("size", sketchpadSection);
}
