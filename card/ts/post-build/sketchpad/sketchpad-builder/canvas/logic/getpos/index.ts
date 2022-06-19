import { getMousePos } from "./mouse";
import { getTouchPos } from "./touch";

export function getPos(e: MouseEvent | TouchEvent): [number, number] {
  if (e instanceof MouseEvent) {
    return getMousePos(e);
  } else if (e instanceof TouchEvent) {
    return getTouchPos(e);
  } else {
    throw new Error("Can't get position of non mouse or touch event");
  }
}
