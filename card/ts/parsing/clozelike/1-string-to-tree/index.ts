import {
  buildTree,
  ContentComponent,
  TreeBuilderArr,
  TreeNode,
} from "../../parse-to-tree";
import {
  possiblyRecursiveTArray,
  possiblyRecursiveTArrayElement,
} from "../globals";

var GROUP = {
  START: "⟮" as const,
  END: "⟯" as const,
};

export function parseClozeLikesToTree(
  text: string
): possiblyRecursiveTArray<string> {
  let clozeArray: possiblyRecursiveTArray<string> = [];
  let unparsedChildrenCharArray: string[] = [...text];
  let chainOfDepth: possiblyRecursiveTArray<string>[] = [clozeArray];
  let label: string = "";
  let currentLevel: possiblyRecursiveTArray<string> = clozeArray;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === GROUP.START) {
      if (label.length > 0) {
        currentLevel.push(label);
      }
      let newLevel: possiblyRecursiveTArrayElement<string> = [];
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

function stringWithClozelikesToTreeComponentArray(
  inputStr: string
): TreeBuilderArr {
  let clozeComponentArray: TreeBuilderArr = inputStr
    .split(GROUP.START)
    .flatMap((partGoingDeeper) => {
      let [partActuallyGoingDeeper, ...partsGoingHigher] =
        partGoingDeeper.split(GROUP.END);

      let downStringSplit: TreeBuilderArr = [
        { upDown: 1 },
        { content: partActuallyGoingDeeper },
      ];
      let upStringSplit: TreeBuilderArr = partsGoingHigher.flatMap(
        (partGoingHigher) => [{ upDown: -1 }, { content: partGoingHigher }]
      );
      let resArr: TreeBuilderArr = [...downStringSplit, ...upStringSplit];
      return resArr;
    });
  return clozeComponentArray;
}

export function parseClozeLikesToTree2(html: string): TreeNode {
  return buildTree(stringWithClozelikesToTreeComponentArray(html));
}
