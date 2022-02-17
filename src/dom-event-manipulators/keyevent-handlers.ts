export function applyKeyHandlers(): void {
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
