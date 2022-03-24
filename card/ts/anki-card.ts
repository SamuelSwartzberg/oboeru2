// Backness to attr

import log from "loglevel";

var backIndicator = document.querySelector(".is-back-indicator");
var isBackOriginal: boolean = !!backIndicator;
if (backIndicator) backIndicator.remove(); // Remove the temporary back indicator

// Toggle back-frontness

if (isBackOriginal) {
  document.body.classList.add("is-back");
  document.body.classList.remove("is-front");
} else {
  document.body.classList.add("is-front");
}

export function isFront(): boolean {
  const isFront = document.body.classList.contains("is-front");
  log.debug("Called isFront(), was front: " + isFront);
  return isFront;
}

export function currentCardIndex(): number {
  let bodyClassListArray = Array.from(document.body.classList.values());
  let classIndicatingClass = bodyClassListArray.find(
    (element) => element.startsWith("card") && element.length > 4
  );
  if (!classIndicatingClass)
    throw new Error(
      "there is no class on body indicating which cloze this is. We cannot function without such an indication."
    );
  else {
    const parsedCardIndex = parseInt(classIndicatingClass.slice(4), 10);
    log.debug(
      `Called currentCardIndex(), which parsed the index of ${parsedCardIndex} from ${classIndicatingClass}.`
    );
    return parsedCardIndex;
  }
}

export function scrollClozeIntoView(): void {
  let firstActiveCloze = document.querySelector(".c-active");
  if (!firstActiveCloze) throw new Error("no active cloze in document");
  log.debug(`Aquired ${firstActiveCloze.outerHTML} for scrolling into view.`);
  firstActiveCloze.scrollIntoView(true);
  if (!(window.innerHeight + window.scrollY >= document.body.scrollHeight)) {
    // you're not at the bottom of the page
    window.scrollBy(0, -100);
    log.debug(
      "Scroll up a bit to better place the cloze (which we can since we're not at the bottom of the page)."
    );
  }
}

export function formatTags(): void {
  var tagContainer = document.querySelector("#tag-container");
  if (tagContainer) {
    const oldTagContents = tagContainer.innerHTML;
    const newTagContents = oldTagContents
      .split("::")
      .map((tagElement: string) => tagElement.replace(/-/g, " "))
      .join('<span class="breadcrumb-separator"> / </span>');
    tagContainer.innerHTML = newTagContents;
    log.debug(
      `Called formatTags(), which formatted the tag container from ${oldTagContents} to ${newTagContents}.`
    );
  } else throw new Error("No tag container found, but one should be present.");
}
