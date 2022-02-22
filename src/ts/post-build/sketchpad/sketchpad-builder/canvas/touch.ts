export function getTouchPos(e: TouchEvent): [number, number] {
  if (e.touches && e.touches.length == 1) {
    // Only deal with one finger
    var touch = e.touches[0]; // Get the information for finger #1
    let touchX = touch.pageX - (touch.target as HTMLElement).offsetLeft;
    let touchY = touch.pageY - (touch.target as HTMLElement).offsetTop;
    return [touchX, touchY];
  } else return [0, 0];
}
