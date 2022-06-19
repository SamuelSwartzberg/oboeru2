import { Point } from "./drawing";

export function setLastPos(sketchpadSection: HTMLElement, coords: Point) {
  sketchpadSection.dataset.lastX = coords.x.toString();
  sketchpadSection.dataset.lastY = coords.y.toString();
}

export function getLastPos(sketchpadSection: HTMLElement): Point | undefined {
  if (sketchpadSection.dataset.lastX && sketchpadSection.dataset.lastY) {
    return {
      x: parseInt(sketchpadSection.dataset.lastX, 10),
      y: parseInt(sketchpadSection.dataset.lastY, 10),
    };
  } else return undefined;
}

export function unsetLastPos(sketchpadSection: HTMLElement) {
  delete sketchpadSection.dataset.lastX;
  delete sketchpadSection.dataset.lastY;
}
