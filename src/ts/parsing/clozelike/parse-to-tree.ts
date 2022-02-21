var GROUP = {
  START: "⟮" as const,
  END: "⟯" as const,
};
export type possiblyRecursiveStringArray = (
  | string
  | possiblyRecursiveStringArray
)[];

export function parseClozeLikesToTree(
  text: string
): possiblyRecursiveStringArray {
  let clozeArray: possiblyRecursiveStringArray = [];
  let unparsedChildrenCharArray: string[] = [...text];
  let chainOfDepth: possiblyRecursiveStringArray[] = [clozeArray];
  let label: string = "";
  let currentLevel: possiblyRecursiveStringArray = clozeArray;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === GROUP.START) {
      if (label.length > 0) {
        currentLevel.push(label);
      }
      let newLevel: string | string[] = [];
      currentLevel.push(newLevel);
      currentLevel = newLevel;
      chainOfDepth.push(currentLevel);
      label = "";
    } else if (currentChar === GROUP.END) {
      currentLevel.push(label);
      chainOfDepth.pop();
      currentLevel = chainOfDepth[chainOfDepth.length - 1];
      label = "";
    } else {
      label += currentChar;
    }
  }
  clozeArray.push(label);
  return clozeArray;
}
