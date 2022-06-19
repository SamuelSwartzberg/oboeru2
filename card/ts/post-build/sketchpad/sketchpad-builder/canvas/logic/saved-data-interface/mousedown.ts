export function setMouseDown(val: boolean) {
  document.body.dataset.mouseDown = val.toString();
}

export function isMouseDown() {
  return document.body.dataset.mouseDown === "true";
}
