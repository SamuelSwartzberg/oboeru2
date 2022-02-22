export function addEvents(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  canvas.addEventListener("mousedown", start(ctx), false);
  window.addEventListener("mouseup", end(ctx), false);
  canvas.addEventListener("mousemove", move(ctx), false);
  // React to touch events on the canvas
  canvas.addEventListener("touchstart", start(ctx), false);
  canvas.addEventListener("touchend", end(ctx), false);
  canvas.addEventListener("touchmove", move(ctx), false);
}
