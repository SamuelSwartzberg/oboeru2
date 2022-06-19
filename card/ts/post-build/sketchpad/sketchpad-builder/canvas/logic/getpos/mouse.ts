import { Point } from "../drawing";

export function getMousePos(e: MouseEvent): Point {
  return {
    x: Math.round(e.offsetX) || 0,
    y: Math.round(e.offsetY) || 0,
  };
}
