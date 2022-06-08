import { deleteAllChildren } from "../../globals/dom-util";

export function getTempContainer(): HTMLTemplateElement {
  const parsedContainer = document.getElementById("parsed-container");
  if (!parsedContainer || !(parsedContainer instanceof HTMLTemplateElement))
    throw new Error("No container for parsed elements.");
  return parsedContainer;
}

export function getContentContainer(): HTMLElement {
  let contentContainer = document.getElementById("content-container");
  if (!contentContainer) throw new Error("No content container.");

  deleteAllChildren(contentContainer); // clear previous content, which can persist in certain circumstances
  return contentContainer;
}
