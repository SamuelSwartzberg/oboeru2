import { WithParsedActionMappings } from "../../../transform-tree/mappers/parse-action-mapping-to-action-targets";
import { NarrowTreeElement } from "../../reduce-tree-string";
import { getStringFromWithParsedActionMappingsTreeElement } from "../globals";

export function getReducedClozelikeStringFromWithParsedActionMappingsTreeElement(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  return getStringFromWithParsedActionMappingsTreeElement(
    treeElement,
    getReducedClozelikeFromClozelike
  );
}

export function getReducedClozelikeFromClozelike(
  treeElement: NarrowTreeElement<WithParsedActionMappings>
): string {
  let clozeString = "";
  if (treeElement.contents.hint) {
    clozeString = "：" + treeElement.contents.hint;
  }
  if (treeElement.contents.actionMappings) {
    if (
      treeElement.contents.parsedActionMappings &&
      treeElement.contents.parsedActionMappings.c &&
      treeElement.contents.parsedActionMappings.c.cardsForWhichToApply
    ) {
      if (!treeElement.contents.separatedActionMappings)
        treeElement.contents.separatedActionMappings = {};
      treeElement.contents.separatedActionMappings.c =
        treeElement.contents.parsedActionMappings.c.cardsForWhichToApply
          .map((elem) => elem.toString())
          .join(",");
    }
  }
  const mappingString = Object.entries(
    treeElement.contents.separatedActionMappings as { [k: string]: string }
  )
    .map(([key, value]) => key + value)
    .join(";");
  return `⟮${mappingString};${treeElement.value}${clozeString}⟯`;
}
