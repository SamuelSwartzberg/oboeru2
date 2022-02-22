import { getClosestSketchpadSection } from "..";
import { saveSketchpad } from "../front-back-io";
import { Stroke } from "../stroke";
import { getLastPos, setLastPos, unsetLastPos } from "./lastpos";

export function getClosestSketchpadSectionFromContext(
  ctx: CanvasRenderingContext2D
): HTMLElement {
  return getClosestSketchpadSection(ctx.canvas);
}

function getSizeAndColor(sketchpadSection: HTMLElement): [number, string] {
  if (!(sketchpadSection.dataset.color && sketchpadSection.dataset.size))
    throw new Error("no color or size so cannot proceed");
  let [rawSize, rawColor] = [
    sketchpadSection.dataset.size,
    sketchpadSection.dataset.color,
  ];
  let [strokeSize, strokeColor] = [
    Stroke.getSizeValue(rawSize),
    Stroke.getColorValue(rawColor),
  ];
  return [strokeSize, strokeColor];
}

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
  const [lastX, lastY] = getLastPos(sketchpadSection) || [x, y];
  [ctx.lineWidth, ctx.strokeStyle] = getSizeAndColor(sketchpadSection);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
  setLastPos(sketchpadSection, [x, y]);
}

export function start(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
    if (e instanceof MouseEvent) sketchpadSection.dataset.mousedown = "true";
    drawFunction(ctx, e);
  };
}

export function move(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
    if (
      e instanceof TouchEvent ||
      sketchpadSection.dataset.mousedown === "false"
    )
      drawFunction(ctx, e);
  };
}

export function end(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
    unsetLastPos(sketchpadSection);
    if (e instanceof MouseEvent) sketchpadSection.dataset.mousedown = "false";
    saveSketchpad(ctx.canvas.toDataURL());
  };
}

function drawFunction(
  ctx: CanvasRenderingContext2D,
  e: MouseEvent | TouchEvent
) {
  let [posX, posY] = [0, 0];
  if (e instanceof MouseEvent) {
    [posX, posY] = getMousePos(e);
  } else if (e instanceof TouchEvent) {
    [posX, posY] = getTouchPos(e);
  }
  drawLine(ctx, posX, posY);
  e.preventDefault();
}
