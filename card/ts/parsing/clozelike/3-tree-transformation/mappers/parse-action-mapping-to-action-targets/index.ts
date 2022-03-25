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

export function parseActionMapping(
  treeElement: TreeElement<WithSplitActionMappings>
): TreeElement<WithParsedActionMappings> {
  if (treeElement.contents.clozelike) {
    if (treeElement.contents.separatedActionMappings) {
      const parsedActionMappings: { [k: string]: ActionTargetsObject } = {};
      if (
        Object.keys(treeElement.contents.separatedActionMappings).length === 0
      )
        treeElement.contents.separatedActionMappings["c"] = "+";
      for (const [key, value] of Object.entries(
        treeElement.contents.separatedActionMappings
      )) {
        parsedActionMappings[key] = parseActionTargets(value, key === "c");
      }
      const newTreeElement: TreeElement<WithParsedActionMappings> = {
        ...treeElement,
        contents: {
          ...treeElement.contents,
          parsedActionMappings,
        },
      };
      return newTreeElement;
    } else
      throw new Error(
        "Cannot parse action mappings without separated action mappings."
      );
  } else return treeElement as TreeElement<WithSplitActionMappings>;
}

// don't forget to default to cloze
