var tagContainer = document.querySelector("#tag-container");
if (tagContainer) {
  tagContainer.innerHTML = tagContainer.innerHTML
    .split("::")
    .map((tagElement: string) => tagElement.replace(/-/g, " "))
    .join('<span class="breadcrumb-separator"> / </span>');
} else throw new Error("No tag container found, but one should be present.");
