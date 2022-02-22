export function addEvents(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  canvas.addEventListener("mousedown", start("mouse", ctx), false);
  window.addEventListener("mouseup", end("mouse", ctx), false);
  canvas.addEventListener("mousemove", move("mouse", ctx), false);
  // React to touch events on the canvas
  canvas.addEventListener("touchstart", start("touch", ctx), false);
  canvas.addEventListener("touchend", end("touch", ctx), false);
  canvas.addEventListener("touchmove", move("touch", ctx), false);
}
