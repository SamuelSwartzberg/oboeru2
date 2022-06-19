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
  if (e instanceof MouseEvent)
    closestElements.sketchpadSection.dataset.mousedown = "true";
  createLine(e, closestElements);
}

export function move(e: MouseEvent | TouchEvent) {
  log.debug("move");
  const closestElements = getClosestElements(e.target as HTMLElement);

  if (closestElements.sketchpadSection.dataset.dirty !== "true") {
    initializeCanvas(closestElements.canvas);
    closestElements.sketchpadSection.dataset.mousedown = "false";
    closestElements.sketchpadSection.dataset.dirty = "true";
  }

  if (
    e instanceof TouchEvent ||
    closestElements.sketchpadSection.dataset.mousedown === "true"
  )
    createLine(e, closestElements);
  return true;
}

export function end(e: MouseEvent | TouchEvent) {
  log.debug("end");
  const closestElements = getClosestElements(e.target as HTMLElement);
  unsetLastPos(closestElements.sketchpadSection);
  if (e instanceof MouseEvent)
    closestElements.sketchpadSection.dataset.mousedown = "false";
  saveSketchpad(closestElements.ctx.canvas.toDataURL());
  return true;
}
