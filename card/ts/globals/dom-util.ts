export function deleteAllChildren(elem: HTMLElement): void {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
}
