export class Stroke {
  static colors = {
    red: "#ff0000",
    yellow: "#ffff00",
    green: "#00ff00",
    blue: "#0000ff",
    black: "#000000",
    white: "#ffffff",
  } as const;
  static sizes = {
    small: 3,
    medium: 13,
    large: 40,
  };
  static initialValueName = {
    color: "black",
    size: "small",
  };
  static getPossibleSizes() {
    return Object.keys(Stroke.sizes);
  }
  static getPossibleColors() {
    return Object.keys(Stroke.colors);
  }
  static isValidColor(color: string): color is keyof typeof Stroke.colors {
    return color in this.colors;
  }
  static getColorValue(color: string): string {
    if (this.isValidColor(color)) return this.colors[color];
    else throw new Error("invalid color");
  }
  static isValidSize(size: string): size is keyof typeof Stroke.sizes {
    return size in this.sizes;
  }
  static getSizeValue(size: string) {
    if (this.isValidSize(size)) return this.sizes[size];
    else throw new Error("invalid size");
  }
  static getInitialValueName(type: "color" | "size") {
    return this.initialValueName[type];
  }
}
