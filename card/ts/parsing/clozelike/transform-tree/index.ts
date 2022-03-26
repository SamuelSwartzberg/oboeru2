import log from "loglevel";
import { BooleanClozelike } from "../transform-array-tree-to-structured-tree/map-string-tree-to-structured-tree";
import { flattenTree } from "./flatten-tree";
import { TreeElement } from "./globals";
import { mapTree } from "./map-tree";
import {
  parseActionMappingTreeElement,
  ParsedActionMapping,
  WithParsedActionMappings,
} from "./mappers/parse-action-mapping-to-action-targets";
import { separateHintTreeElement, WithHint } from "./mappers/separate-hint";
import {
  splitActionMappingTreeElement,
  WithSplitActionMappings,
} from "./mappers/splitting/split-action-mapping";
import {
  splitSpecifierTreeELement,
  WithSpecifier,
} from "./mappers/splitting/split-specifier";
import { isDifferentTree } from "./tests/diff-tree";

export function mapStructuredTreeToParsedClozelikes(
  structuredTree: TreeElement<BooleanClozelike>
): TreeElement<WithParsedActionMappings> {
  const hintSeparatedTree = mapAndTestTree<BooleanClozelike, WithHint>(
    structuredTree,
    "separateHintTreeElement",
    separateHintTreeElement,
    true
  );
  const splitSpeciferTree = mapAndTestTree<WithHint, WithSpecifier>(
    hintSeparatedTree,
    "splitSpecifierTreeELement",
    splitSpecifierTreeELement,
    true
  );

  const splitActionMappingTree = mapAndTestTree<
    WithSpecifier,
    WithSplitActionMappings
  >(
    splitSpeciferTree,
    "splitActionMappingTreeElement",
    splitActionMappingTreeElement,
    true
  );
  const parsedActionMappingTree = mapAndTestTree<
    WithSplitActionMappings,
    WithParsedActionMappings
  >(
    splitActionMappingTree,
    "parseActionMappingTreeElement",
    parseActionMappingTreeElement
  );
  runTestsOnFinalTree(parsedActionMappingTree);
  return parsedActionMappingTree;
}
splitSpecifierTreeELement;

function mapAndTestTree<T, U>(
  treeElement: TreeElement<T>,
  name: string,
  transformationCallback: (treeElement: TreeElement<T>) => TreeElement<U>,
  dontErrorOnlyWarnIfTreesHaveSameContent: boolean = false
): TreeElement<U> {
  log.debug(`Transforming tree with ${name}().`);
  const newTreeElement = mapTree<T, U>(treeElement, transformationCallback);
  log.debug("The new tree is:");
  log.debug(JSON.stringify(newTreeElement, null, 2));
  if (newTreeElement.children.length === 0) {
    throw new Error(
      `${name}() returned a tree with no children. This is not allowed.`
    );
  }
  if (treeElement === (newTreeElement as unknown as TreeElement<T>))
    throw new Error(
      "The new tree is the same object as the old tree, which should be impossible."
    );
  if (!dontErrorOnlyWarnIfTreesHaveSameContent) {
    if (!isDifferentTree(treeElement, newTreeElement))
      throw new Error("The old tree and the new tree are the same in content.");
  } else log.warn("The old tree and the new tree are the same in content.");

  return newTreeElement;
}

function runTestsOnFinalTree(
  treeElementIsFinalTree: TreeElement<WithParsedActionMappings>
): void {
  log.debug("Running tests on the final tree.");
  const treeElementIsFinalTreeClone = { ...treeElementIsFinalTree };
  const flattenedTree = flattenTree(treeElementIsFinalTreeClone);
  const flattenedTreeContents = flattenedTree.map(
    (treeElement) => treeElement.contents
  );
  const flattenedTreeContentsOnlyClozelikes = flattenedTreeContents.filter(
    (treeElement) => treeElement.clozelike
  );
  const flattenedTreeContentsOnlyClozelikesWithParsedActionMappingsOrUndefined: (
    | ParsedActionMapping
    | undefined
  )[] = flattenedTreeContentsOnlyClozelikes.map(
    (treeElement) => treeElement.parsedActionMappings
  );
  const flattenedTreeContentsOnlyClozelikesWithParsedActionMappings: ParsedActionMapping[] =
    flattenedTreeContentsOnlyClozelikesWithParsedActionMappingsOrUndefined.filter(
      (parsedActionMappings) => parsedActionMappings !== undefined
    ) as ParsedActionMapping[];

  const flattenedTreeContentsOnlyNonClozelikes = flattenedTreeContents.filter(
    (treeElement) => !treeElement.clozelike
  );

  const NON_CLOZELIKES_SANITY_CHECK_LOWER_LIMIT = 7;

  if (
    flattenedTreeContentsOnlyNonClozelikes.length <
    NON_CLOZELIKES_SANITY_CHECK_LOWER_LIMIT
  )
    throw new Error(
      `There are less than ${NON_CLOZELIKES_SANITY_CHECK_LOWER_LIMIT} non-clozelike elements in the flattened tree, this is almost certainly unintended.`
    );

  const CLOZELIKES_WITH_PARSED_ACTION_MAPPINGS_SANITY_CHECK_LOWER_LIMIT = 5;

  if (
    flattenedTreeContentsOnlyClozelikesWithParsedActionMappings.length <
    CLOZELIKES_WITH_PARSED_ACTION_MAPPINGS_SANITY_CHECK_LOWER_LIMIT
  )
    throw new Error(
      `There are less than ${CLOZELIKES_WITH_PARSED_ACTION_MAPPINGS_SANITY_CHECK_LOWER_LIMIT} clozelike elements in the flattened tree, this is almost certainly unintended.`
    );

  testForMissingClozeNumbers(
    flattenedTreeContentsOnlyClozelikesWithParsedActionMappings
  );
  sameClozeNumberSanityCheck(
    flattenedTreeContentsOnlyClozelikesWithParsedActionMappings
  );
  log.debug("All tests passed.");
}

function sameClozeNumberSanityCheck(
  parsedActionMappings: ParsedActionMapping[]
): void {
  let clozeIndexCounter: { [key: number]: number } = {};
  for (const parsedActionMapping of parsedActionMappings) {
    if (parsedActionMapping.c && parsedActionMapping.c.cardsForWhichToApply) {
      parsedActionMapping.c.cardsForWhichToApply.forEach((cardIndex) => {
        clozeIndexCounter[cardIndex] = clozeIndexCounter[cardIndex] + 1 || 1;
      });
    }
  }
  for (const [clozeIndex, count] of Object.entries(clozeIndexCounter)) {
    if (count > 6)
      throw new Error(
        `There are more than 6 clozes for card index ${clozeIndex}, this is almost certainly unintended.`
      );
    if (count > 3)
      log.warn(
        `There are more than 3 clozess for card index ${clozeIndex}, which seems excessive.`
      );
  }
}
function testForMissingClozeNumbers(
  parsedActionMappings: ParsedActionMapping[]
): void {
  const clozeNumberReducedTree = parsedActionMappings.reduce<Set<number>>(
    (accumulator: Set<number>, currentValue: ParsedActionMapping) => {
      if (!currentValue.c || !currentValue.c.cardsForWhichToApply)
        return accumulator;
      for (const cardForWhichToApply of currentValue.c.cardsForWhichToApply)
        accumulator.add(cardForWhichToApply);
      return accumulator;
    },
    new Set<number>()
  );
  const sortedClozeNumbers = Array.from(clozeNumberReducedTree).sort(
    (a, b) => a - b
  );
  let previousSortedClozeNumber = 0;
  for (const sortedClozeNumber of sortedClozeNumbers) {
    if (sortedClozeNumber !== previousSortedClozeNumber + 1)
      log.error(
        `There is a gap in the cloze numbers. The cloze number ${sortedClozeNumber} is the next-largest after ${previousSortedClozeNumber}.`
      );
    previousSortedClozeNumber = sortedClozeNumber;
  }
}
