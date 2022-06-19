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
import { isMouseDown, setMouseDown } from "./saved-data-interface/mousedown";

interface ClosestElements {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  sketchpadSection: HTMLElement;
}

function getClosestElements(target: HTMLElement): ClosestElements {
  const canvas = target.closest("canvas");
  if (!canvas) throw new Error("no canvas found");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no context found");
  const sketchpadSection = getClosestSketchpadSection(canvas);
  return { canvas, ctx, sketchpadSection };
}

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function createLine(
  e: MouseEvent | TouchEvent,
  closestElements: ClosestElements
) {
  const end = getPos(e);
  const start = getLastPos(closestElements.sketchpadSection) || end;
  const line: Line = {
    start,
    end,
  };
  drawLine(
    closestElements.ctx,
    line,
    getSizeAndColor(closestElements.sketchpadSection)
  );
  setLastPos(closestElements.sketchpadSection, end);
  if (e.cancelable) e.preventDefault();
}

function initializeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

export function start(e: MouseEvent | TouchEvent) {
  log.debug("start");
  const closestElements = getClosestElements(e.target as HTMLElement);
  setLastPos(closestElements.sketchpadSection, getPos(e));
  if (e instanceof MouseEvent) setMouseDown(true);
}

export function move(e: MouseEvent | TouchEvent) {
  log.debug("move");
  const closestElements = getClosestElements(e.target as HTMLElement);

  if (closestElements.sketchpadSection.dataset.dirty !== "true") {
    initializeCanvas(closestElements.canvas);
    setMouseDown(true);
    closestElements.sketchpadSection.dataset.dirty = "true";
  }

  if (e instanceof TouchEvent || isMouseDown()) createLine(e, closestElements);
  saveSketchpad(closestElements.ctx.canvas.toDataURL());
  return true;
}

export function end(e: MouseEvent | TouchEvent) {
  log.debug("end");
  if (e instanceof MouseEvent) setMouseDown(false);
}
