import { ActionTargetsObject } from ".";
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

export function actionTargetsToResolvedNumber(
  actionTargets: string[],
  isCloze: boolean
): string[] {
  let newActionTargets: string[] = [];
  for (const actionTargetPart of actionTargets) {
    if (
      actionTargetPart === "a" ||
      actionTargetPart === "b" ||
      actionTargetPart === "∞"
    )
      newActionTargets.push(actionTargetPart);
    else {
      newActionTargets.push(
        ...handleNumericActionTargetPart(actionTargetPart, isCloze).map(
          (actionTarget) => actionTarget.toString()
        )
      );
    }
  }
  return newActionTargets;
}
