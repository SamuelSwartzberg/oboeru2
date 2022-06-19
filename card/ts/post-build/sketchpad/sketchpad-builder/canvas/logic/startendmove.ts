import log from "loglevel";
import { getClosestSketchpadSection } from "../..";
import { saveSketchpad } from "../../front-back-io";
import {
  getLastPos,
  setLastPos,
  unsetLastPos,
} from "./saved-data-interface/lastpos";
import { getPos } from "./getpos";
import { drawLine, Line, Point } from "./drawing";
import { getSizeAndColor } from "./saved-data-interface/size-and-color";

export function getClosestSketchpadSectionFromContext(
  ctx: CanvasRenderingContext2D
): HTMLElement {
  return getClosestSketchpadSection(ctx.canvas);
}

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function createLine(ctx: CanvasRenderingContext2D, end: Point) {
  const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
  const start = getLastPos(sketchpadSection) || end;
  const line: Line = {
    start,
    end,
  };
  drawLine(ctx, line, getSizeAndColor(sketchpadSection));
  setLastPos(sketchpadSection, end);
}

function initializeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

export function start(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);

    if (e instanceof MouseEvent) sketchpadSection.dataset.mousedown = "true";
    drawFunction(ctx, e);
    return true;
  };
}

export function move(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    log.debug("move");

    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);

    if (sketchpadSection.dataset.dirty !== "true") {
      initializeCanvas(ctx.canvas);
      sketchpadSection.dataset.mousedown = "false";
      sketchpadSection.dataset.dirty = "true";
    }

    if (
      e instanceof TouchEvent ||
      sketchpadSection.dataset.mousedown === "true"
    )
      drawFunction(ctx, e);
    return true;
  };
}

export function end(ctx: CanvasRenderingContext2D) {
  return function (e: MouseEvent | TouchEvent) {
    log.debug("end");
    const sketchpadSection = getClosestSketchpadSectionFromContext(ctx);
    unsetLastPos(sketchpadSection);
    if (e instanceof MouseEvent) sketchpadSection.dataset.mousedown = "false";
    saveSketchpad(ctx.canvas.toDataURL());
    return true;
  };
}

function drawFunction(
  ctx: CanvasRenderingContext2D,
  e: MouseEvent | TouchEvent
) {
  let [posX, posY] = getPos(e);
  createLine(ctx, { x: posX, y: posY });
  if (e.cancelable) e.preventDefault();
}
