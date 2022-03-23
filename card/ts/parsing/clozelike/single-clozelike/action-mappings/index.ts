import {
  actionTargetsToObject,
  actionTargetsToResolvedNumber,
} from "./action-targets-to-object";
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
  return getActionNameAnResultantThingFromActionMappingString(
    actionMappingString,
    actionTargetsToObject
  );
}

export function getActionNameAndResolvedActionTargetNumbersFromActionMappingString(
  actionMappingString: string
): [string, string[]] | undefined {
  return getActionNameAnResultantThingFromActionMappingString(
    actionMappingString,
    actionTargetsToResolvedNumber
  );
}

function getActionNameAnResultantThingFromActionMappingString<T>(
  actionMappingString: string,
  callback: (actionTargets: string[], isCloze: boolean) => T
): [string, T] | undefined {
  try {
    let [actionName, actionTargetsString] =
      splitActionMappingStringIntoNameAndTargetsString(actionMappingString);

    let isCloze = actionName === "c";
    let actionTargets =
      splitActionTargetStringIntoActionTargets(actionTargetsString);
    let resultantThing = callback(actionTargets, isCloze);
    return [actionName, resultantThing];
  } catch (e) {
    return undefined;
  }
}
