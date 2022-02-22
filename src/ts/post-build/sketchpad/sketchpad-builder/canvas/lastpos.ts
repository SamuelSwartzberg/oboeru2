export function setLastPos(
  sketchpadSection: HTMLElement,
  coords: [number, number]
) {
  sketchpadSection.dataset.lastX = coords[0].toString();
  sketchpadSection.dataset.lastY = coords[1].toString();
}

export function getLastPos(
  sketchpadSection: HTMLElement
): [number, number] | undefined {
  if (sketchpadSection.dataset.lastX && sketchpadSection.dataset.lastY) {
    return [
      parseInt(sketchpadSection.dataset.lastX, 10),
      parseInt(sketchpadSection.dataset.lastY, 10),
    ];
  } else return undefined;
}

export function unsetLastPos(sketchpadSection: HTMLElement) {
  delete sketchpadSection.dataset.lastX;
  delete sketchpadSection.dataset.lastY;
}
