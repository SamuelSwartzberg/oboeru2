export function getRaw(): { rawTags: string; rawContent: string } {
  const rawContentContainer = document.getElementById("raw-content");
  if (!rawContentContainer) throw new Error("No text content.");
  const rawTagsContainer = document.getElementById("raw-tags");
  if (!rawTagsContainer) throw new Error("No tags.");
  let rawTags = rawTagsContainer.innerHTML.trim();
  let rawContent = rawContentContainer.innerHTML.trim();
  return { rawTags, rawContent };
}
