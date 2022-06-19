import { Point } from "../drawing";

export function getMousePos(e: MouseEvent): Point {
  let [mouseX, mouseY] = [0, 0];
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } /* else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
      } */
  return { x: mouseX, y: mouseY };
}
