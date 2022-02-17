export function setActiveGroups(): void {
  document.querySelectorAll(".cloze-group").forEach((clozeGroup) => {
    if (clozeGroup.querySelector(".c-active")) {
      clozeGroup.classList.add("group-active");
    }
    // for now, all non-active groups are hidden
    // we might implement the more complicated semantics of yon later
    else {
      clozeGroup.classList.add("h-active");
    }
  });

  document.querySelectorAll(".group-active").forEach((activeGroup) => {
    let childrenWhichArePotentialTargets = activeGroup.querySelectorAll(
      ".is-cloze-scramble-or-hide"
    );
    let conditionWeCareAbout = "a";
    for (let child of childrenWhichArePotentialTargets) {
      if (child.classList.contains("c-active")) {
        conditionWeCareAbout = "b";
        continue;
      }
      child.classList.forEach((className: string) => {
        let [classSpecifier, classValue] = className.split("-");
        if (classValue === conditionWeCareAbout)
          child.classList.add(`${classSpecifier}-active`);
      });
    }
  });
}
