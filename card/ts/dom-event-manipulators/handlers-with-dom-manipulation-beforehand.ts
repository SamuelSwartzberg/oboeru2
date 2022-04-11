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
  appendToExtraInfoButtonSection(
    button: HTMLDivElement,
    templateTree: DocumentFragment
  ) {
    let extraInfoButtonSection = templateTree.querySelector(
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

function showHideFurigana(e: MouseEvent): any {
  if (e.target instanceof Element) {
    let furiganaList = document.querySelectorAll("rt");
    furiganaList.forEach((furigana) => {
      furigana.classList.add("show");
    });
    e.target.classList.remove("show");
  }
}

export function createClickableElements(templateTree: DocumentFragment): void {
  let furiganaList = templateTree.querySelectorAll("rt");
  if (furiganaList.length > 0) {
    DOMInserterFunctions.appendToExtraInfoButtonSection(
      elementFactory.extraInfoButton("furi u", showHideFurigana),
      templateTree
    );
  }
}
