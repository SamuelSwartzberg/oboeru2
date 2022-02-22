function getMousePos(e: MouseEvent): [number, number] {
  let mouseX, mouseY;
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    console.log("offset");
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
    console.log("layer");
  }
  return [mouseX, mouseY];
}