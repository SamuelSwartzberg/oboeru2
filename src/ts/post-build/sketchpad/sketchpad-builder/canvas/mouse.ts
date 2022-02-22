function getMousePos(e) {
  if (!e) var e = event;
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    console.log("offset");
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
    console.log("layer");
  }
}
