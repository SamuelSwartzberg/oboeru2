import { actionTargetsToObject } from "./action-mappings/action-targets-to-object";

type groupIfAny = "a" | "b" | null;
export type ActionTargetsObject = {
  cardsForWhichToApply: number[];
  all: boolean;
  group: groupIfAny;
};

export function parseActionTargets(
  actionTargetsString: string,
  isCloze: boolean
): ActionTargetsObject {
  return actionTargetsToObject(actionTargetsString.split(","), isCloze);
}
