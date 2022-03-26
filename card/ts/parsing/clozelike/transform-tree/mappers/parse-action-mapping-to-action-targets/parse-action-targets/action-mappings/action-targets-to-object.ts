import { ActionTargetsObject } from "..";
import { handleNumericActionTargetPart } from "./numeric-action-target-part";

export function actionTargetsToObject(
  actionTargets: string[],
  isCloze: boolean
): ActionTargetsObject {
  let actionTargetsObject: ActionTargetsObject = {
    cardsForWhichToApply: [],
    all: false,
    group: null,
  };

  for (const actionTargetPart of actionTargets) {
    if (actionTargetPart === "a" || actionTargetPart === "b")
      actionTargetsObject.group = actionTargetPart;
    else if (actionTargetPart === "∞") actionTargetsObject.all = true;
    else {
      actionTargetsObject.cardsForWhichToApply.push(
        ...handleNumericActionTargetPart(actionTargetPart, isCloze)
      );
    }
  }
  return actionTargetsObject;
}
