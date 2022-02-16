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
  showHideFurigana(e: MouseEvent): any {
    if (e.target instanceof Element) {
      let furiganaList = document.querySelectorAll("rt");
      furiganaList.forEach((furigana) => {
        furigana.classList.add("show");
      });
      e.target.classList.remove("show");
    }
  },
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

applyClickHandlerToElementsMatchingSelector({
  selector: "img",
  onclick: clickHandlers.toggleGrowShrinkElement,
});

applyClickHandlerToElementsMatchingSelector({
  selector: ".ipa, ruby, code, q, cite, .term",
  onclick: clickHandlers.toggleMagnifiedClass,
});

addKeyEventHandlers: {
  document.addEventListener("keydown", (event) => {
    if (event.key === "u") {
      (
        document.querySelector(
          ".extra-info-button-section__button.show"
        ) as HTMLDivElement
      ).click();
    }
    // do something
  });
}

manipulateDOMBeforeAddingEventHandlers: {
  let elementFactory = {
    extraInfoButton(
      textLabel: string,
      onclick: (e: MouseEvent) => any
    ): HTMLDivElement {
      // Generates the general logic of all extra info buttons
      let button = document.createElement("div");
      [button.id, button.innerHTML] = [textLabel, textLabel];
      button.onclick = onclick;
      button.classList.add("extra-info-button-section__button", "show");
      return button;
    },
  };
  let DOMInserterFunctions = {
    appendToExtraInfoButtonSection(button: HTMLDivElement) {
      let extraInfoButtonSection = document.querySelector(
        ".extra-info-button-section"
      );
      if (!extraInfoButtonSection)
        throw new Error(
          "No extra info button section, but is in Anki template and thus must exist."
        );
      if (!extraInfoButtonSection.querySelector(`#${button.id}`)) {
        // if the button does not exist yet
        extraInfoButtonSection.append(button);
      }
    },
  };

  let furiganaList = document.querySelectorAll("rt");

  if (furiganaList.length > 0) {
    DOMInserterFunctions.appendToExtraInfoButtonSection(
      elementFactory.extraInfoButton("furi u", clickHandlers.showHideFurigana)
    );
  }
}
