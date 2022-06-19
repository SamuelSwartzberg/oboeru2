import { loadFromFront, saveFrontToBack } from "../../../front-back-io";
import { isReady } from "../../../globals/optimizers";

export function saveSketchpad(value: string) {
  if (isReady("sketchpad", 100)) {
    saveFrontToBack("sketchpad", value);
  }
}
export function loadSketchpad(): string {
  return loadFromFront("sketchpad", true);
}
