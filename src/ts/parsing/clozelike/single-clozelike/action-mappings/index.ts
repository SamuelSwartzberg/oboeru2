import { actionTargetsToObject } from "./action-targets-to-object";
import { splitActionMappingStringIntoNameAndTargetsString } from "./split-action-mapping-string";

function splitActionTargetStringIntoActionTargets(
  actionTargetString: string
): string[] {
  return actionTargetString.split(",");
}

type groupIfAny = "a" | "b" | null;
export type ActionTargetsObject = {
  cardsForWhichToApply: number[];
  all: boolean;
  group: groupIfAny;
  hint?: string;
};

export function getActionNameAndActionTargetsFromActionMappingString(
  actionMappingString: string
): [string, ActionTargetsObject] | undefined {
  try {
    let [actionName, actionTargetsString] =
      splitActionMappingStringIntoNameAndTargetsString(actionMappingString);

    let isCloze = actionName === "c";
    let actionTargets =
      splitActionTargetStringIntoActionTargets(actionTargetsString);
    let actionTargetsAsObject: ActionTargetsObject = actionTargetsToObject(
      actionTargets,
      isCloze
    );
    return [actionName, actionTargetsAsObject];
  } catch (e) {
    return undefined;
  }
}
