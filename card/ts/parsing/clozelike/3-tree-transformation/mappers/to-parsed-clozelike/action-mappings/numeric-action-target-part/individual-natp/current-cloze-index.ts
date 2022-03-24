var currentClozeIndex = 0;

export function setCurrentClozeIndex(index: number): void {
  currentClozeIndex = index;
}

export function getCurrentClozeIndex(): number {
  return currentClozeIndex;
}
