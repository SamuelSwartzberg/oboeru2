import { isFront } from "../../../../anki-card";
import { loadSketchpad } from "../front-back-io";
import { addEvents } from "./event-adding";

export function buildCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.classList.add("sketchpad-canvas");
  if (!isFront()) canvas.style.background = `url(${loadSketchpad()})`; // gets the drawing from the front on the back
  let ctx = canvas.getContext("2d");
  if (ctx instanceof CanvasRenderingContext2D) {
    addEvents(canvas, ctx); // adds all the drawing events, this is where the magic happens
  } else
    throw new Error(
      "Canvas context is not a CanvasRenderingContext2D or doesn't exist"
    );
  return canvas;
}
