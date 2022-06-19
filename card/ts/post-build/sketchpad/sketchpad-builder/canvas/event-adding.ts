import { end, move, start } from "./logic/startendmove";

export function addEvents(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", start, false);
  window.addEventListener("mouseup", end, false);
  canvas.addEventListener("mousemove", move, false);
  // React to touch events on the canvas
  canvas.addEventListener("touchstart", start, false);
  window.addEventListener("touchend", end, false);
  canvas.addEventListener("touchmove", move, false);
}
