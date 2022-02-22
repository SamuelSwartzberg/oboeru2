function getTouchPos(e) {
  if (!e) var e = event;
  if (e.touches) {
    if (e.touches.length == 1) {
      // Only deal with one finger
      var touch = e.touches[0]; // Get the information for finger #1
      touchX = touch.pageX - touch.target.offsetLeft;
      touchY = touch.pageY - touch.target.offsetTop;
    }
  }
}
