import { Stroke } from "../../../stroke";

export interface SizeAndColor {
  size: number;
  color: string;
}

export function getSizeAndColor(sketchpadSection: HTMLElement): SizeAndColor {
  if (!(sketchpadSection.dataset.color && sketchpadSection.dataset.size))
    throw new Error("no color or size so cannot proceed");
  let [rawSize, rawColor] = [
    sketchpadSection.dataset.size,
    sketchpadSection.dataset.color,
  ];
  return {
    size: Stroke.getSizeValue(rawSize),
    color: Stroke.getColorValue(rawColor),
  };
}
