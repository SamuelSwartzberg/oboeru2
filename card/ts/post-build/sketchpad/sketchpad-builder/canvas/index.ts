import log from "loglevel";
import { isFront } from "../../../../anki-card";
import { loadSketchpad } from "../front-back-io";
import { addEvents } from "./event-adding";

export function buildCanvas(): HTMLCanvasElement {
  log.setLevel("debug");
  const canvas = document.createElement("canvas");
  canvas.classList.add("sketchpad-canvas");
  if (!isFront()) canvas.style.background = `url(${loadSketchpad()})`; // gets the drawing from the front on the back
  addEvents(canvas);
  return canvas;
}
