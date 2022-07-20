import { highlightVisibleCode } from "./code";
import { formatVisibleClozeGroups } from "./inline-formatting-front-only";
import { addSketchpadIfClozesWithKanji } from "./sketchpad";

export function decoratePostBuild(templateTree: DocumentFragment): void {
  formatVisibleClozeGroups(templateTree);
  highlightVisibleCode(templateTree);
  addSketchpadIfClozesWithKanji(templateTree);
  addAdditionalClasses(templateTree);
}
function addAdditionalClasses(templateTree: DocumentFragment) {
  templateTree
    .querySelectorAll(".section > .wide-table")
    .forEach((sectionInnerTable: Element) => {
      sectionInnerTable.parentElement?.classList.add("wide-table");
    });
}
