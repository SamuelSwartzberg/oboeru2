import log from "loglevel";

export function initBackness() {
  // Backness to attr

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
  firstActiveCloze.scrollIntoView(false);
  window.scrollBy(
    0,
    firstActiveCloze.getBoundingClientRect().bottom - window.innerHeight / 2
  );
  firstActiveCloze
    .closest(".section")
    ?.scrollBy(
      firstActiveCloze.getBoundingClientRect().right - window.innerWidth / 2,
      0
    );
}

export function getTags(rawTags: string): string {
  const newTagContents = rawTags
    .split("::")
    .map(
      (tagElement: string) =>
        `<span class="tag-element">${tagElement.replace(/-/g, " ")}</span>`
    )
    .join('<span class="breadcrumb-separator"> / </span>');
  return newTagContents;
}
