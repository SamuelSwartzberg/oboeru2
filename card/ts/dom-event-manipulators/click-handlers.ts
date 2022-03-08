type HandlerSelectorMapping = {
  selector: string;
  onclick: (e: MouseEvent) => any;
};

function applyClickHandlerToElementsMatchingSelector(
  handlerSelectorMapping: HandlerSelectorMapping
): void {
  document.querySelectorAll(handlerSelectorMapping.selector).forEach((item) => {
    item.addEventListener(
      "click",
      handlerSelectorMapping.onclick as (e: Event) => any
    );
  });
}
let clickHandlers = {
  toggleGrowShrinkElement(e: MouseEvent): any {
    if (e.target instanceof Element) {
      if (
        e.target.parentElement &&
        e.target.parentElement.classList.contains("is-cloze-scramble-or-hide")
      ) {
        // If the image is within a is-cloze-scramble-or-hide element, do it on the parent instead, since that's whats constraining it size-wise
        e.target.parentElement.classList.toggle("fullsize");
      } else {
        e.target.classList.toggle("fullsize");
      }
    }
  },
  toggleMagnifiedClass(e: MouseEvent): any {
    if (e.target instanceof Element) {
      e.target.classList.toggle("magnified");
    }
  },
};

export function applyClickHandlers(): void {
  applyClickHandlerToElementsMatchingSelector({
    selector: "img",
    onclick: clickHandlers.toggleGrowShrinkElement,
  });

  applyClickHandlerToElementsMatchingSelector({
    selector: ".ipa, ruby, code, q, cite, .term",
    onclick: clickHandlers.toggleMagnifiedClass,
  });
}
