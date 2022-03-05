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

export function isFront(): boolean {
  return document.body.classList.contains("is-front");
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
    return parseInt(classIndicatingClass.slice(4), 10);
  }
}

export function scrollClozeIntoView(): void {
  let firstActiveCloze = document.querySelector(".c-active");
  if (!firstActiveCloze) throw new Error("no active cloze in document");
  firstActiveCloze.scrollIntoView(true);
  if (!(window.innerHeight + window.scrollY >= document.body.scrollHeight)) {
    // you're not at the bottom of the page
    window.scrollBy(0, -100);
  }
}

export function formatTags(): void {
  var tagContainer = document.querySelector("#tag-container");
  if (tagContainer) {
    tagContainer.innerHTML = tagContainer.innerHTML
      .split("::")
      .map((tagElement: string) => tagElement.replace(/-/g, " "))
      .join('<span class="breadcrumb-separator"> / </span>');
  } else throw new Error("No tag container found, but one should be present.");
}
