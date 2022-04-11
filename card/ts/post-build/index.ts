import { highlightVisibleCode } from "./code";
import { formatVisibleClozeGroups } from "./inline-formatting-front-only";
import { addSketchpadIfClozesWithKanji } from "./sketchpad";

export function decoratePostBuild(templateTree: DocumentFragment): void {
  formatVisibleClozeGroups(templateTree);
  highlightVisibleCode(templateTree);
  addSketchpadIfClozesWithKanji(templateTree);
}
