import { Point } from "../drawing";

export function getTouchPos(e: TouchEvent): Point {
  if (e.touches && e.touches.length == 1) {
    // Only deal with one finger
    var touch = e.touches[0]; // Get the information for finger #1
    let touchX =
      touch.clientX -
      (touch.target as HTMLElement).getBoundingClientRect().left;
    let touchY =
      touch.clientY - (touch.target as HTMLElement).getBoundingClientRect().top;
    return { x: Math.round(touchX), y: Math.round(touchY) };
  } else return { x: 0, y: 0 };
}
