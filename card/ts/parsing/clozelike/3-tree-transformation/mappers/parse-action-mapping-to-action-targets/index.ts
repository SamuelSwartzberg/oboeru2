import log from "loglevel";
import { TreeElement } from "../../globals";
import { WithSplitActionMappings } from "../splitting/split-action-mapping";
import { WithSpecifier } from "../splitting/split-specifier";
import {
  ActionTargetsObject,
  parseActionTargets,
} from "./parse-action-targets";

type ParsedActionMappings = {
  parsedActionMappings?: {
    [k: string]: ActionTargetsObject;
  };
};

export type WithParsedActionMappings = WithSpecifier & ParsedActionMappings;

export function parseActionMappingTreeElement(
  treeElement: TreeElement<WithSplitActionMappings>
): TreeElement<WithParsedActionMappings> {
  log.debug(
    "parseActionMappingTreeElement was called to handle a tree element..."
  );
  if (treeElement.contents.clozelike) {
    log.debug("...and it was 🟩  a clozelike");
    if (!treeElement.contents.separatedActionMappings) {
      log.debug("had no separatedActionMappings, adding empty object");
      treeElement.contents.separatedActionMappings = {};
    }

    const parsedActionMappings: { [k: string]: ActionTargetsObject } = {};
    if (
      Object.keys(treeElement.contents.separatedActionMappings).length === 0
    ) {
      log.debug("separatedActionMappings had no key, adding default cloze key");
      treeElement.contents.separatedActionMappings["c"] = "+";
    }

    for (const [actionName, actionTargetString] of Object.entries(
      treeElement.contents.separatedActionMappings
    )) {
      log.debug(
        `Parsing action mapping with: actionName: ${actionName}, actionTargetString: ${actionTargetString}`
      );
      parsedActionMappings[actionName] = parseActionTargets(
        actionTargetString,
        actionName === "c"
      );
      log.debug(
        `Resulted in a parsed action with an action name of ${actionName} and a value of: ${JSON.stringify(
          parsedActionMappings[actionName]
        )}`
      );
    }
    log.debug(`parsedActionMappings: ${JSON.stringify(parsedActionMappings)}`);
    const newTreeElement: TreeElement<WithParsedActionMappings> = {
      ...treeElement,
      contents: {
        ...treeElement.contents,
        parsedActionMappings,
      },
    };
    log.debug(`Will return: ${JSON.stringify(newTreeElement)}`);
    return newTreeElement;
  } else {
    log.debug("...but it was 🟨  not a clozelike");
    return { ...treeElement };
  }
}

// don't forget to default to cloze
