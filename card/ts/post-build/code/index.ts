import hljs from "highlight.js";
import {
  getEmojiForLanguage,
  isLanguageInMapping,
} from "./language-emoji-mapping";

export function highlightVisibleCode(templateTree: DocumentFragment) {
  templateTree
    .querySelectorAll("group-active > pre > code")
    .forEach((block) => {
      if (block instanceof HTMLElement) {
        let codeLanguages = Array.from(block.classList).filter((className) =>
          isLanguageInMapping(className)
        );
        let codeEmoji = codeLanguages.map((codeLanguage) =>
          getEmojiForLanguage(codeLanguage)
        );
        if (codeEmoji) block.dataset.codeLabel = codeEmoji.join(" ");
        hljs.highlightElement(block);
      } else
        throw new Error(
          "qsa on `group-active > pre > code` yielded a non-HTMLElement, but this should not be possible."
        );
    });
}
