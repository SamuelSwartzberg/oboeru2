import log from "loglevel";
import { WithParsedActionMappings } from "../../transform-tree/mappers/parse-action-mapping-to-action-targets";
import { NarrowTreeElement } from "../reduce-tree-string";

export function getStringFromWithParsedActionMappingsTreeElement(
  treeElement: NarrowTreeElement<WithParsedActionMappings>,
  callback: (treeElement: NarrowTreeElement<WithParsedActionMappings>) => string
): string {
  log.debug("Getting string for tree element with parsed action mappings...");
  if (treeElement.contents.clozelike) {
    log.debug("...and it was 🟩  a clozelike");
    return callback(treeElement);
  } else {
    log.debug("...and it was 🟨  not a clozelike ");
    return treeElement.value;
  }
}
