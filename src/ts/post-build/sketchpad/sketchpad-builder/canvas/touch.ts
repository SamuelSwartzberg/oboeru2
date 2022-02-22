function getTouchPos(e: TouchEvent): [number, number] {
  if (e.touches) {
    if (e.touches.length == 1) {
      // Only deal with one finger
      var touch = e.touches[0]; // Get the information for finger #1
      touchX = touch.pageX - (touch.target as HTMLElement).offsetLeft;
      touchY = touch.pageY - (touch.target as HTMLElement).offsetTop;
      return [touchX, touchY];
    }
  }
}
