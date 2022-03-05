import { loadFromFront, saveFrontToBack } from "../../../front-back-io";

export function saveSketchpad(value: string) {
  saveFrontToBack("sketchpad", value);
}
export function loadSketchpad() {
  loadFromFront("sketchpad", true);
}
