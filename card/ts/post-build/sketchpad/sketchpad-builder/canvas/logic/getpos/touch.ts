import { Point } from "../drawing";

export function getTouchPos(e: TouchEvent): Point {
  if (e.touches && e.touches.length == 1) {
    // Only deal with one finger
    var touch = e.touches[0]; // Get the information for finger #1
    let touchX = touch.pageX - (touch.target as HTMLElement).offsetLeft;
    let touchY = touch.pageY - (touch.target as HTMLElement).offsetTop;
    return { x: touchX, y: touchY };
  } else return { x: 0, y: 0 };
}
