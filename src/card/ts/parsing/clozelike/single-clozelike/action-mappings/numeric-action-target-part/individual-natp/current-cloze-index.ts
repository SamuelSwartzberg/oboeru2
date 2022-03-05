var currentClozeIndex = 1;

export function setCurrentClozeIndex(index: number): void {
  currentClozeIndex = index;
}

export function getCurrentClozeIndex(): number {
  return currentClozeIndex;
}
