import { Stroke } from "../painting/stroke";
import { buildPicker } from "./picker";

export function buildColorPicker(): HTMLDivElement {
  return buildPicker("color");
}
