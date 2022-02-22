var mouseX,
  mouseY,
  mouseDown = 0;
var touchX, touchY;
var lastX,
  lastY = -1;

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number) {
  if (lastX == -1) {
    lastX = x;
    lastY = y;
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
  ctx.closePath();
  lastX = x;
  lastY = y;
}

function sketchpad_mouseDown() {
  mouseDown = 1;
  drawLine(ctx, mouseX, mouseY);
} // Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseUp() {
  mouseDown = 0;
  lastX = -1;
  lastY = -1;
  saveImage();
}
function sketchpad_mouseMove(e) {
  getMousePos(e);
  if (mouseDown == 1) {
    drawLine(ctx, mouseX, mouseY);
  }
}

function sketchpad_touchStart() {
  getTouchPos();
  drawLine(ctx, touchX, touchY);
  event.preventDefault();
}
function sketchpad_touchEnd() {
  lastX = -1;
  lastY = -1;
  saveImage();
}
function sketchpad_touchMove(e) {
  getTouchPos(e);
  drawLine(ctx, touchX, touchY);
  event.preventDefault();
}
