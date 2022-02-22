export function decoratePostBuild(): void {
  addSketchpadIfClozesWithKanji();
  highlightVisibleCode();
  formatVisibleClozeGroups();
}
