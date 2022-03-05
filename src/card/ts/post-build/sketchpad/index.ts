import { addSketchpad } from "./sketchpad-builder";

function isKanji(ch: string): boolean {
  return (
    (ch >= "\u4e00" && ch <= "\u9faf") || (ch >= "\u3400" && ch <= "\u4dbf")
  );
} // from https://www.darrenlester.com/blog/recognising-japanese-characters-with-javascript

export function addSketchpadIfClozesWithKanji() {
  console.log("addSketchpadIfClozesWithKanji");

  let activeClozes = document.querySelectorAll(".c-active");
  let clozesWithKanji = Array.from(activeClozes).filter((cloze) => {
    if (cloze.textContent) {
      return Array.from(cloze.textContent).some(isKanji);
    } else return false;
  });
  clozesWithKanji.forEach((cloze) => {
    console.log(`Adding sketchpad to cloze ${cloze.textContent}`);
    let nearestSection = cloze.closest(".section");
    if (nearestSection) {
      addSketchpad(nearestSection);
    } else
      throw new Error("Cloze with kanji is not in a section, which is odd.");
  });
}
