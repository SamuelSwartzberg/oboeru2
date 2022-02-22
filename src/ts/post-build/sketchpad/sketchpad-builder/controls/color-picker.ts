import { buildPicker } from "./picker";

export function buildColorPicker(sketchpadSection: HTMLElement): HTMLDivElement {
  return buildPicker("color", sketchpadSection);
}
