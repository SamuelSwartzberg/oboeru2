import { SizeAndColor } from "./saved-data-interface/size-and-color";

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  line: Line,
  sizeAndColor: SizeAndColor
) {
  ctx.lineWidth = sizeAndColor.size;
  ctx.strokeStyle = sizeAndColor.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(line.start.x, line.start.y);
  ctx.lineTo(line.end.x, line.end.y);
  ctx.stroke();
  ctx.closePath();
}
