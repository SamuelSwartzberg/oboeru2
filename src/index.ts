// Backness to attr

var backIndicator = document.querySelector(".is-back-indicator");
var isBackOriginal: boolean = !!backIndicator;
if (backIndicator) backIndicator.remove(); // Remove the temporary back indicator

// Toggle back-frontness

if (isBackOriginal) {
  document.body.classList.add("is-back");
  document.body.classList.remove("is-front");
} else {
  document.body.classList.add("is-front");
}

// Helpers

// Helper function to figure out if we're back or not

var ankiCard = {
  currentCardIndex(): number {
    let bodyClassListArray = Array.from(document.body.classList.values());
    let classIndicatingClass = bodyClassListArray.find(
      (element) => element.startsWith("card") && element.length > 4
    );
    if (!classIndicatingClass)
      throw new Error(
        "there is no class on body indicating which cloze this is. We cannot function without such an indication."
      );
    else {
      return parseInt(classIndicatingClass.slice(4), 10);
    }
  },
};

// mappings

type TextWrapperHTMLWrapperMapEntry = {
  delimiters: {
    start: string;
    end: string;
  };
  replacements: {
    start: string;
    end: string;
  };
};

type TextWrapperHTMLWrapperMap = {
  [entry: string]: TextWrapperHTMLWrapperMapEntry;
};

type TextWrapperHTMLWrapperMapEntryDelimSpecifier = {
  start: string;
  end: string;
};

var textWrapperHTMLWrapperMap: TextWrapperHTMLWrapperMap = {
  mdStyleBacktickCode: {
    delimiters: {
      start: "`",
      end: "`",
    },
    replacements: {
      start: "<code>",
      end: "</code>",
    },
  },
  mdStyleBoldCustom: {
    delimiters: {
      start: "⁑",
      end: "⁑",
    },
    replacements: {
      start: "<b>",
      end: "</b>",
    },
  },
  mdStyleItalicCustom: {
    delimiters: {
      start: "＊",
      end: "＊",
    },
    replacements: {
      start: "<i>",
      end: "</i>",
    },
  },
  mdStyleUnderlineCustom: {
    delimiters: {
      start: "＿",
      end: "＿",
    },
    replacements: {
      start: "<u>",
      end: "</u>",
    },
  },
  definitions: {
    delimiters: {
      start: "»",
      end: "«",
    },
    replacements: {
      start: "<dfn>",
      end: "</dfn>",
    },
  },
  cite: {
    delimiters: {
      start: "『",
      end: "』",
    },
    replacements: {
      start: "<cite>",
      end: "</cite>",
    },
  },
  mark: {
    delimiters: {
      start: "☞",
      end: "☜",
    },
    replacements: {
      start: "<mark>",
      end: "</mark>",
    },
  },
  q: {
    delimiters: {
      start: "「",
      end: "」",
    },
    replacements: {
      start: "<q>",
      end: "</q>",
    },
  },
  aside: {
    delimiters: {
      start: "⦗",
      end: "⦘",
    },
    replacements: {
      start: '<span class="aside">',
      end: "</span>",
    },
  },
  ipa: {
    delimiters: {
      start: "［",
      end: "］",
    },
    replacements: {
      start: '<span class="ipa">',
      end: "</span>",
    },
  },
  ipaPhon: {
    delimiters: {
      start: "／",
      end: "／",
    },
    replacements: {
      start: '<span class="ipa phoneme">',
      end: "</span>",
    },
  },
};

function buildRegexFromDelimiters(
  delimiters: TextWrapperHTMLWrapperMapEntryDelimSpecifier
): RegExp {
  return new RegExp(
    `(?<!\\\\)${delimiters.start}([^${delimiters.end}]+?)(?<!\\\\)${delimiters.end}`,
    "g"
  );
}

function buildReplacementsFromReplacementDelimiters(
  replacements: TextWrapperHTMLWrapperMapEntryDelimSpecifier
): string {
  return `${replacements.start}$1${replacements.end}`;
}

var regexReplacements: [RegExp, string][] = Object.values(
  textWrapperHTMLWrapperMap
).map((value: TextWrapperHTMLWrapperMapEntry) => {
  let returnArr: [RegExp, string] = [
    buildRegexFromDelimiters(value.delimiters),
    buildReplacementsFromReplacementDelimiters(value.replacements),
  ];
  return returnArr;
});

// Format tags

var tagContainer = document.querySelector("#tag-container");
if (tagContainer) {
  tagContainer.innerHTML = tagContainer.innerHTML
    .split("::")
    .map((tagElement: string) => tagElement.replace(/-/g, " "))
    .join('<span class="breadcrumb-separator"> / </span>');
} else throw new Error("No tag container found, but one should be present.");

// Add processing of my custom cloze syntax, eventually to replace the html syntax I've been using
// The syntax for marking things as clozes, scrambles, hides etc is (in ENBF)
// S ::= ⟮[c:<cloze-specificer>;][s:<showhide-specifier>;][h:<showhide-specifier>;]<content>⟯
// cloze-speicifer ::= <number-specifier> | all
// showhide-specifier ::= <number-specifier> | <group-based-specifier> | ∞
// number-specifier ::= <number>{,<number-specifier>} | <number>-<number>
// number ::= (0-9){0-9}
// group-based-specifier ::= b | a // before or after

// for now, only process if explicitly enabled

var container = document.querySelector(".container");
if (!container) throw new Error("No main container.");
var currentClozeIndex = 1;

function handleNumberNumberSpecifier(
  specifier: string,
  isCloze: boolean
): number {
  let tryParseInt = parseInt(specifier, 10);
  if (isNaN(tryParseInt))
    throw new Error(`Invalid number specifier: ${specifier}`);
  if (isCloze) currentClozeIndex = tryParseInt;
  return tryParseInt;
}

var incrementSyntaxCharacters: readonly string[] = ["+", "-", "_"];

function handleIncrementNumberSpecifier(
  specifier: string,
  isCloze: boolean
): number {
  let viewModeOnly: boolean = false;
  if (specifier.length > 1 && specifier.startsWith("_")) {
    viewModeOnly = true;
    specifier = specifier.slice(1);
  }
  let [incrementOperator, incrementRest] = [
    specifier.slice(0, 1),
    specifier.slice(1),
  ];
  if (!incrementSyntaxCharacters.includes(incrementOperator))
    throw new Error(
      `Increment specifier is not starting with an increment operator. This error should only be able to occur if viewModeOnly is true, as we've filtered other non-valid operator already.`
    );
  let increment = NaN;
  if (incrementRest.length === 0) increment = 1;
  else {
    let tryParseInt = parseInt(incrementRest, 10);
    if (isNaN(tryParseInt))
      throw new Error(`Invalid increment amount: ${incrementRest}`);
    increment = tryParseInt;
  }
  let newValue = currentClozeIndex;
  if (incrementOperator === "+") newValue += increment;
  else if (incrementOperator === "-") newValue -= increment;
  // else if (incrementOperator === "_") newValue = newValue;, but there's no need to actually execute this
  if (isCloze && !viewModeOnly) currentClozeIndex = newValue;
  return newValue;
}

function handleIndividualNumberSpecifier(
  specifier: string,
  isCloze: boolean
): number {
  if (incrementSyntaxCharacters.some((item) => specifier.startsWith(item)))
    return handleIncrementNumberSpecifier(specifier, isCloze);
  else return handleNumberNumberSpecifier(specifier, isCloze);
}

function handleRangeSpecifier(specifier: string, isCloze: boolean): number[] {
  var specifierStartEnd = specifier.split(":");
  var specifierStartEndInt = specifierStartEnd.map((specpart) =>
    handleIndividualNumberSpecifier(specpart, isCloze)
  );
  return Array.from(
    Array(specifierStartEndInt[1] - specifierStartEndInt[0] + 1).keys()
  ).map((i) => specifierStartEndInt[0] + i);
}

function extractNumbersThatThingAppliesTo(
  part: string,
  isCloze: boolean
): number[] {
  if (part.includes(":")) return handleRangeSpecifier(part, isCloze);
  else return [handleIndividualNumberSpecifier(part, isCloze)];
}

function parseSpecifierIntoKeyValue(specifier: string): [string, string] {
  let prefixLength = 0;
  if (specifier[0] === "u") prefixLength++;
  // starts with u, so at least 2 long
  if (specifier[prefixLength] === "h" && specifier[prefixLength + 1] === "r")
    prefixLength += 2;
  // hr/uhr are always one longer
  else if (["c", "s", "h"].some((item) => specifier[prefixLength] === item))
    prefixLength++;
  else throw new Error("Tried to parse non-specifier into specifier.");
  return [specifier.slice(0, prefixLength), specifier.slice(prefixLength)];
}

function separateIntoSpecifiersAndNonspecifiers<T>(
  contents: string,
  parseSpecifierIntoKeyValueCallback: (
    specifier: string
  ) => [string, T] | undefined
): [
  string,
  {
    [k: string]: T;
  }
] {
  let constituents: string[] = contents.split(";");
  let nonspecifier = "";
  let specifiers: {
    [k: string]: T;
  } = {};
  for (let i = 0; i < constituents.length; i++) {
    // make sure that only approved specifiers count as specifiers, to allow ; in the contents
    if (i === constituents.length - 1) {
      // final loop, no need to do any checking, the last thing can't be a specifier
      nonspecifier = constituents.slice(i).join(";");
      break;
    }
    let constituentAsSpecifier = parseSpecifierIntoKeyValueCallback(
      constituents[i]
    );
    if (!constituentAsSpecifier) {
      // part doesn't start with an approved specifier
      nonspecifier = constituents.slice(i).join(";"); // so we're done with the specifier part, rejoin the thing.
      break;
    } else {
      specifiers[constituentAsSpecifier[0]] = constituentAsSpecifier[1]; // this is a specifier, so add it to the specifiers
    }
  }
  return [nonspecifier, specifiers];
}

function splitSpecifierIntoConstituents(specifierValue: string): string[] {
  return specifierValue.split(",");
}

type groupIfAny = "a" | "b" | null;
type clozeLikeSpecifier = {
  cardsForWhichToApply: number[];
  all: boolean;
  group: groupIfAny;
  hint?: string;
};

function parseValuePartsToObject(
  specifierValueParts: string[],
  isCloze: boolean
): clozeLikeSpecifier {
  let specifierObject: clozeLikeSpecifier = {
    cardsForWhichToApply: [],
    all: false,
    group: null,
  };
  console.log(specifierValueParts);

  for (const part of specifierValueParts) {
    if (part === "a" || part === "b") specifierObject.group = part;
    else if (part === "∞") specifierObject.all = true;
    else {
      specifierObject.cardsForWhichToApply.push(
        ...extractNumbersThatThingAppliesTo(part, isCloze)
      );
    }
    // else do nothing
  }
  return specifierObject;
}

function getKeyAndParsedSpecifierFromSpecifier(
  specifier: string
): [string, clozeLikeSpecifier] | undefined {
  try {
    console.log(specifier);

    let [specifierKey, specifierValue] = parseSpecifierIntoKeyValue(specifier);
    console.log(specifierKey, specifierValue);

    let isCloze = specifierKey === "c";
    let specifierValueParts = splitSpecifierIntoConstituents(specifierValue);
    let specifierValuesParsedToObject: clozeLikeSpecifier =
      parseValuePartsToObject(specifierValueParts, isCloze);
    return [specifierKey, specifierValuesParsedToObject];
  } catch (e) {
    console.log(e);

    return undefined;
  }
}

function tryAddHint(hint: string) {
  if (hint.length > 0) {
    return `style="--content-when-active: ${hint}"`;
  }
}

function getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(specifierMapping: {
  [k: string]: clozeLikeSpecifier;
}): string[] {
  return Object.entries(specifierMapping).map(([specifierType, specifier]) => {
    let classList: string[] = [];
    if (specifier.group) classList.push(`${specifierType}-${specifier.group}`);
    if (specifier.all) classList.push(`${specifierType}-active`);
    else if (
      specifier.cardsForWhichToApply.includes(ankiCard.currentCardIndex())
    )
      classList.push(`${specifierType}-active`);
    return classList.join(" ");
  });
}

function processCustomClozelikes(contents: string): string {
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    getKeyAndParsedSpecifierFromSpecifier
  );

  if (Object.keys(specifiers).length === 0) return contents;
  let [clozelikeBody, ...possiblyHint] = nonspecifier.split("::");
  let hint: string = Array.isArray(possiblyHint) ? possiblyHint.join("::") : "";
  let activityClasses =
    getClassesCorrespondingToCurrentMeaningOfClozelikeSpecifiers(specifiers);
  return `<span class="is-cloze-scramble-or-hide ${activityClasses.join(
    " "
  )}" ${
    activityClasses.includes("c-active") ? tryAddHint(hint) : ""
  }>${clozelikeBody}</span>`;
}

// we need to parse the cloze-like things recursively, ignore the above code for now

var GROUP = {
  START: "⟮" as const,
  END: "⟯" as const,
};
type possiblyRecursiveStringArray = (string | possiblyRecursiveStringArray)[];

function parseClozeLikesToTree(text: string): possiblyRecursiveStringArray {
  let clozeArray: possiblyRecursiveStringArray = [];
  let unparsedChildrenCharArray: string[] = [...text];
  let chainOfDepth: possiblyRecursiveStringArray[] = [clozeArray];
  let label: string = "";
  let currentLevel: possiblyRecursiveStringArray = clozeArray;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === GROUP.START) {
      if (label.length > 0) {
        currentLevel.push(label);
      }
      let newLevel: string | string[] = [];
      currentLevel.push(newLevel);
      currentLevel = newLevel;
      chainOfDepth.push(currentLevel);
      label = "";
    } else if (currentChar === GROUP.END) {
      currentLevel.push(label);
      chainOfDepth.pop();
      currentLevel = chainOfDepth[chainOfDepth.length - 1];
      label = "";
    } else {
      label += currentChar;
    }
  }
  clozeArray.push(label);
  return clozeArray;
}

function replaceClozeLikes(
  clozeLikeArrayTree: possiblyRecursiveStringArray,
  isTop: boolean
): string {
  if (Array.isArray(clozeLikeArrayTree) && clozeLikeArrayTree.length === 1) {
    return processCustomClozelikes(clozeLikeArrayTree[0] as string);
  } else if (!Array.isArray(clozeLikeArrayTree)) {
    return clozeLikeArrayTree;
  } else {
    if (isTop)
      return clozeLikeArrayTree
        .map((elem) =>
          replaceClozeLikes(elem as possiblyRecursiveStringArray, false)
        )
        .join("");
    else
      return processCustomClozelikes(
        clozeLikeArrayTree
          .map((elem) =>
            replaceClozeLikes(elem as possiblyRecursiveStringArray, false)
          )
          .join("")
      );
  }
}

var futureContainerHTML: string = container.innerHTML.trim();

function countLeadingHashSigns(line: string): number {
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== "#") return i;
  }
  return 0;
}

var arrUtil = {
  lastElement<T>(arr: T[]): T {
    return this.nthLastElement(arr, 0);
  },
  nthLastElement<T>(arr: T[], n: number): T {
    return arr[arr.length - n - 1];
  },
};

function parseHeaderIntoFlagsAndContent(
  line: string,
  amountOfLeadingHashSigns: number
): [string, boolean] {
  line = line.slice(amountOfLeadingHashSigns);
  let isGroupShowHeader = false;
  if (line.startsWith(" !")) {
    isGroupShowHeader = true;
    line = line.slice(2);
  }
  return [line.trim(), isGroupShowHeader];
}

function changeTreeLevelWithElement(
  chainOfDepth: treeNode[],
  amount: number,
  newElement: treeNodeGeneric
): treeNode[] {
  (
    arrUtil.nthLastElement(chainOfDepth, -amount + 1) as treeNodeGeneric
  ).children.push(newElement);
  if (amount - 1 < 0) chainOfDepth = chainOfDepth.slice(0, amount - 1);
  chainOfDepth.push(newElement);
  return chainOfDepth;
}

function finishAndEmptyPreviouslyRecordingElement(
  chainOfDepth: treeNode[],
  contents: string[]
): string[] {
  if (contents.length > 0) {
    (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
      title: "section",
      children: contents,
    });
  }
  return [];
}

type treeNodeGeneric = {
  children: treeNode[];
  title: string;
  depth: number;
  isGroupShowHeader: boolean;
};
type treeNodeRoot = { children: treeNode[]; title: "root" };
type treeNodeLeaf = { children: string[]; title: "section" };
type treeNode = treeNodeRoot | treeNodeGeneric | treeNodeLeaf;

function parseToplevel(rawHTML: string): treeNode {
  let unparsedLines: string[] = rawHTML.split("\n");
  let toplevel: treeNode = { children: [], title: "root" };
  let chainOfDepth: treeNode[] = [toplevel];
  let contents: string[] = [];
  let lastLineWasNewline: boolean = false;
  let lastHeaderDepth: number = 0;

  for (const currentline of unparsedLines) {
    let amountOfLeadingHashSigns: number = countLeadingHashSigns(currentline);
    if (amountOfLeadingHashSigns > 0) {
      let [linecontent, isGroupShowHeader] = parseHeaderIntoFlagsAndContent(
        currentline,
        amountOfLeadingHashSigns
      );
      let amountTheNewHeadingIsDeeperOrHigherThanPreviousLevel: number =
        amountOfLeadingHashSigns - lastHeaderDepth; // 0 = same level; positive = deeper, negative = higher

      lastHeaderDepth = amountOfLeadingHashSigns;

      contents = finishAndEmptyPreviouslyRecordingElement(
        chainOfDepth,
        contents
      );

      let newElement: treeNodeGeneric = {
        children: [],
        title: linecontent,
        depth: amountOfLeadingHashSigns,
        isGroupShowHeader: isGroupShowHeader,
      };

      chainOfDepth = changeTreeLevelWithElement(
        chainOfDepth,
        amountTheNewHeadingIsDeeperOrHigherThanPreviousLevel,
        newElement
      );
    } else {
      if (currentline.length === 0) {
        if (lastLineWasNewline) {
          (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
            title: "section",
            children: contents,
          });
          contents = [];
          lastLineWasNewline = false;
        } else {
          lastLineWasNewline = true;
        }
      } else {
        lastLineWasNewline = false;
        contents.push(currentline);
      }
    }
  }
  (arrUtil.lastElement(chainOfDepth) as treeNodeGeneric).children.push({
    title: "section",
    children: contents,
  });
  return toplevel;
}

function replaceParsedSectionsWithContent(parsedSections: treeNode): string {
  if (parsedSections.children.length === 0) {
    return "";
  } else if (parsedSections.title === "section") {
    return formatSectionOrTable(
      (parsedSections as treeNodeLeaf).children
        .map((line: string) => line.trim())
        .join("\n")
    ); // we know that this is treeNodeLeaf because of the check, but have no way of expressing that in TS in the types
  } else {
    // we know that this is treeNodeGeneric because of the check, but have no way of expressing that in TS in the types
    let newHeader = `<h2 class="${
      !(parsedSections as treeNodeGeneric).isGroupShowHeader
        ? "cloze-group"
        : " "
    }">${parsedSections.title}</h2>`;
    let newContent = (parsedSections as treeNodeGeneric).children
      .map(replaceParsedSectionsWithContent)
      .join("\n");
    if ((parsedSections as treeNodeGeneric).title === "root") return newContent;
    else
      return `<article class="indent-${
        (parsedSections as treeNodeGeneric).depth - 1
      } headered-container cloze-group">${newHeader}${newContent}</article>`;
  }
}

futureContainerHTML = replaceParsedSectionsWithContent(
  parseToplevel(futureContainerHTML)
);

futureContainerHTML = formatInlineLevel(futureContainerHTML);

var parsedTreeCloze = parseClozeLikesToTree(futureContainerHTML);

console.log(parsedTreeCloze);

futureContainerHTML = replaceClozeLikes(parsedTreeCloze, true);

// new parsing syntax, using markdown-like syntax but customized for cloze demands
// for any area between a markdown-like, #-begun heading
// anything delimited by a blank line becomes a section or a table, depending on if there's a table-beginning character
// all # headers become the same in HTML, but all sections/tables beneath them are indented to that level
// every normal line becomes a line that hides its contents if not clozed
// ! at the beginning of a thing escapes its hiding default behavor.
// a line begun with ^ becomes small
// subsequent lines beginning with > become blockquotes
// lines delimited with ``` become code blocks

container.innerHTML = futureContainerHTML;

// TODO: Since <article>s are not nested, parent headings cannot be made visible when in children, except by making the whole group visible, which is nonsense. This needs to be fixed, probably by nesting

function formatSectionOrTable(rawHTMLText: string): string {
  let formattedHTML: string = "";
  let isGroupShow = false;
  if (rawHTMLText === "") {
    return "";
  }
  if (rawHTMLText.startsWith("！")) {
    isGroupShow = true;
    rawHTMLText = rawHTMLText.slice(1);
  }
  if (rawHTMLText.startsWith('<span class="cloze-dump">')) {
    return "";
  } else if (rawHTMLText.startsWith("table:")) {
    formattedHTML = parseAsTable(
      rawHTMLText.slice("table:".length),
      isGroupShow
    );
  } /* else if (rawHTMLText.startsWith("onion-box:")) {
    formattedHTML = parseAsOnionBox(
      rawHTMLText.slice("onion-box:".length),
      isGroupShow
    );
  }  */ else if (rawHTMLText.startsWith("flex-container:")) {
    formattedHTML = parseAsFlexContainer(
      rawHTMLText.slice("flex-container:".length),
      isGroupShow
    );
  } else {
    formattedHTML = parseIntoLinesOrLineLike(rawHTMLText, isGroupShow);
  }
  return formattedHTML;
}

function parseIntoLinesOrLineLike(rawHTMLText: string, isGroupShow: boolean) {
  let lineLikes: string = parseIntoLineLike(rawHTMLText);
  return `<section class="${
    !isGroupShow ? "cloze-group" : " "
  } section text-section">${lineLikes}</section>`;
}

function parseIntoLineLike(section: string): string {
  section = section.trim();
  section = section.replace(/^```(.*?)^```/ms, "<pre><code>$1</pre></code>");
  let subsections: string[] = section.split("\n\n");
  let newSection: string[] = [];
  for (let subsection of subsections) {
    let subsectionLines: string[] = subsection.split("\n");
    let newSubsectionLines: string[] = [];
    let currentlyBlockquote = false;
    for (let subsectionLine of subsectionLines) {
      let newSubsectionLine: string = subsectionLine.replace(
        /^(\^?)((?:&gt; )?)((?:- )?)((?:\d\. )?)(!?)(<[^>]+>)?(.*)$/g,
        (
          match,
          isSmall,
          isBlockquote,
          isUnorderedListItem,
          isOrderedListItem,
          isGroupShow,
          isBegunByHTMLTag,
          content
        ) => {
          if (isBegunByHTMLTag) return match;
          let newLine = "";

          // when we encounter a blockquote for the first time, we want to open the HTML tag. Once we're not in a line which is a blockquote anymore, we want to close the HTML tag.
          if (isBlockquote && !currentlyBlockquote) {
            newLine += "<blockquote>";
            currentlyBlockquote = true;
          } else if (!isBlockquote && currentlyBlockquote) {
            newLine += "</blockquote>";
            currentlyBlockquote = false;
          }

          let typeOfElement = {
            type: isUnorderedListItem || isOrderedListItem ? "li" : "span",
            classes: isOrderedListItem
              ? "ordered"
              : isUnorderedListItem
              ? "unordered"
              : "line",
          };

          newLine += `<${typeOfElement.type} class="${typeOfElement.classes} ${
            !isGroupShow ? "cloze-group" : " "
          }${isSmall ? " sub" : ""}">${content}</${typeOfElement.type}>`;
          return newLine;
        }
      );
      newSubsectionLines.push(newSubsectionLine);
    }
    if (currentlyBlockquote) {
      newSubsectionLines.push("</blockquote>");
    }
    let newSubsection = newSubsectionLines.join("\n");
    newSubsection = newSubsection.replace(/^(<li.*<\/li>)$/gms, "<ul>$1</ul>");
    newSection.push(newSubsection);
  }
  return newSection
    .map((subsection) => `<section class="sub-section">${subsection}</section>`)
    .join("\n");
}

// TODO: we only need to format the visible cloze groups on the front

var textToClassMap = {
  "⌘": "cmd",
  "⌥": "alt",
  "⊞": "win",
  "⇧": "shift",
  "⌃": "ctrl",
  fn: "fn",
};
type TextToClassMap = typeof textToClassMap;

function stringIsKeyOfTextToClassMap(str: string): str is keyof TextToClassMap {
  return Object.keys(textToClassMap).includes(str);
}
function formatInlineLevel(htmlBlob: string): string {
  console.time("formatInlineLevelRegex");
  htmlBlob = htmlBlob.replace(
    buildRegexFromDelimiters({
      start: "⟦",
      end: "⟧",
    }),
    function replacerFunction(_, keyContents: string): string {
      if (stringIsKeyOfTextToClassMap(keyContents)) {
        return `<kbd class="modifier ${textToClassMap[keyContents]}"></kbd>`;
      } else return `<kbd>${keyContents}</kbd>`;
    }
  );
  htmlBlob = htmlBlob.replace(
    /(?<!\\)　(?<!\\)([^（]+)（([^）]+)(?<!\\)/g,
    (_, rubyBottom: string, rubyTop: string) => {
      return `<ruby>${rubyBottom}<rp>（</rp><rt>${rubyTop}</rt><rp>）</rp></ruby>`;
    }
  ); // replace custom ruby syntax with ruby HMTL
  for (const [regex, replacement] of regexReplacements) {
    htmlBlob = htmlBlob.replace(regex, replacement);
  }
  console.timeEnd("formatInlineLevelRegex");

  return htmlBlob;
}
type GenericSpecifier = {
  nonspecifier: string;
  class: string;
  style: string;
};

type TableSpecifier = {
  headerrows: string;
} & GenericSpecifier;

type CellSpecifier = {
  span: string;
  type: string;
} & GenericSpecifier;

function isCellSpecifier(specifier: Specifier): specifier is CellSpecifier {
  return specifier.hasOwnProperty("span");
}

type Specifier = CellSpecifier | TableSpecifier;

function parseAsTable(rawHTMLText: string, isGroupShow: boolean) {
  let tableSpec = parseSpecifiers(rawHTMLText, {
    nonspecifier: "",
    class: "",
    style: "",
    headerrows: "1",
  } as TableSpecifier);
  let headerrows: number = parseInt(tableSpec.headerrows, 10);
  if (isNaN(headerrows)) {
    headerrows = 1;
  }
  let rows: string[] = tableSpec.nonspecifier.split("\n");
  let [header, body] = [
    parseListOfRows(rows.slice(0, headerrows), "th").join("\n"),
    parseListOfRows(rows.slice(headerrows), "td").join("\n"),
  ];
  return `<table class="${!isGroupShow ? "cloze-group " : ""}${
    tableSpec.class
  } section" style="${
    tableSpec.style
  }"><thead>${header}</thead><tbody>${body}</tbody></table>`;
}

function parseListOfRows(
  listOfRows: string[],
  cellType: "th" | "td"
): string[] {
  return listOfRows.map((row) => parseRow(row, cellType));
}

function parseRow(row: string, cellType: "th" | "td"): string {
  let isGroupShow: boolean = false;
  if (row.startsWith("!")) {
    isGroupShow = true;
    row = row.slice(1);
  }
  return `<tr class="${!isGroupShow ? "cloze-group" : ""}">${row
    .split("|")
    .map((cell) => surroundCellByCellHTML(cell, cellType))
    .join("")}</tr>`;
}

function parseSpecifiers<SomeSpec extends Specifier>(
  contents: string,
  approvedSpecifierObject: SomeSpec
): SomeSpec {
  let approvedSpecifierObjectKeys = Object.keys(approvedSpecifierObject);
  let [nonspecifier, specifiers] = separateIntoSpecifiersAndNonspecifiers(
    contents,
    function (specfier: string) {
      let [specifierKey, specifierValue] = specfier.split("=");
      if (approvedSpecifierObjectKeys.includes(specifierKey))
        return [specifierKey, specifierValue];
      else return undefined;
    }
  );
  approvedSpecifierObject["nonspecifier"] = nonspecifier;

  return specifiers as SomeSpec;
}

function surroundCellByCellHTML(cellContents: string, cellType: "th" | "td") {
  let _;
  let tableSpecs = parseSpecifiers(cellContents, {
    nonspecifier: "",
    class: "",
    style: "",
    span: "",
    type: cellType,
  } as CellSpecifier);
  let span = tableSpecs.span.split(",");
  span.push("1", "1"); // default values for span, will be ignored if there are enough already
  let parsedSpan = span.map((spanSpec: string) => {
    let parsedSpanSpec = parseInt(spanSpec, 10);
    return Number.isNaN(parsedSpanSpec) ? 1 : parsedSpanSpec;
  });
  return `<${tableSpecs.type} colspan="${parsedSpan}" rowspan="${parsedSpan}" class="${tableSpecs.class}" style="${tableSpecs.style}">${tableSpecs.nonspecifier}</${tableSpecs.type}>`;
}
/* 
function parseAsOnionBox(
  unparsedOnionBoxString: string,
  isGroupShow: boolean
): string {
  let onionBoxStructure = parseOnionBoxStructure(unparsedOnionBoxString);
  return `<section class="${
    !isGroupShow ? "cloze-group" : " "
  } section">${formatOnionBox(onionBoxStructure)}</section>`;
}

function formatOnionBox(onionBoxStructure) {
  let returnString = "";
  for (let [key, value] of Object.entries(onionBoxStructure)) {
    if (value === "leaf") {
      returnString += `<div class="onion-box"><span>${key}</span></div>`;
    } else {
      returnString += `<div class="onion-box"><span>${key}</span>${formatOnionBox(
        value
      )}</div>`;
    }
  }
  return returnString;
}

function parseOnionBoxStructure(unparsedOnionBoxString: string) {
  // an onion box is a nested box that uses labeled bracket notation to describe its layout
  let onionBox = {};
  let unparsedChildrenCharArray = [...unparsedOnionBoxString];
  let chainOfDepth = [];
  let label = "";
  let readingLabel = false;
  let currentLevel = onionBox;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === "[") {
      label = "";
      readingLabel = true; // if we hit an open bracket, we need to start reading the label, any other actions can wait until we've read the label
    } else if (currentChar === "]") {
      if (readingLabel === true) {
        readingLabel = false;
        currentLevel[label] = "leaf";
        chainOfDepth.push(currentLevel);
      }
      chainOfDepth.pop();
      currentLevel = chainOfDepth[chainOfDepth.length - 1];
    } else if (currentChar === " ") {
      // once we hit a space, we've finished reading the label, and we know there will be children
      readingLabel = false;
      // since we know there will be children, we need to prepare a new object, make that the current object and add it to the reference chain, and make the previous current object refer to the new object
      let newLevel = {};
      currentLevel[label] = newLevel;
      currentLevel = newLevel;
      chainOfDepth.push(currentLevel);
    } else if (readingLabel) {
      label += currentChar;
    }
  }
  return onionBox;
} */

function parseAsFlexContainer(rawHTMLText: string, isGroupShow: boolean) {
  return `<div class="flex-container ${
    !isGroupShow ? "cloze-group" : " "
  } section">${rawHTMLText}</div>`;
}
// set the active groups

document.querySelectorAll(".cloze-group").forEach((clozeGroup) => {
  if (clozeGroup.querySelector(".c-active")) {
    clozeGroup.classList.add("group-active");
  }
  // for now, all non-active groups are hidden
  // we might implement the more complicated semantics of yon later
  else {
    clozeGroup.classList.add("h-active");
  }
});

document.querySelectorAll(".group-active").forEach((activeGroup) => {
  let childrenWhichArePotentialTargets = activeGroup.querySelectorAll(
    ".is-cloze-scramble-or-hide"
  );
  let conditionWeCareAbout = "a";
  for (let child of childrenWhichArePotentialTargets) {
    if (child.classList.contains("c-active")) {
      conditionWeCareAbout = "b";
      continue;
    }
    child.classList.forEach((className: string) => {
      let [classSpecifier, classValue] = className.split("-");
      if (classValue === conditionWeCareAbout)
        child.classList.add(`${classSpecifier}-active`);
    });
  }
});

DOMAddEventManipulators: {
  type HandlerSelectorMapping = {
    selector: string;
    onclick: (e: MouseEvent) => any;
  };

  function applyClickHandlerToElementsMatchingSelector(
    handlerSelectorMapping: HandlerSelectorMapping
  ): void {
    document
      .querySelectorAll(handlerSelectorMapping.selector)
      .forEach((item) => {
        item.addEventListener(
          "click",
          handlerSelectorMapping.onclick as (e: Event) => any
        );
      });
  }
  let clickHandlers = {
    showHideFurigana(e: MouseEvent): any {
      if (e.target instanceof Element) {
        let furiganaList = document.querySelectorAll("rt");
        furiganaList.forEach((furigana) => {
          furigana.classList.add("show");
        });
        e.target.classList.remove("show");
      }
    },
    toggleGrowShrinkElement(e: MouseEvent): any {
      if (e.target instanceof Element) {
        if (
          e.target.parentElement &&
          e.target.parentElement.classList.contains("is-cloze-scramble-or-hide")
        ) {
          // If the image is within a is-cloze-scramble-or-hide element, do it on the parent instead, since that's whats constraining it size-wise
          e.target.parentElement.classList.toggle("fullsize");
        } else {
          e.target.classList.toggle("fullsize");
        }
      }
    },
    toggleMagnifiedClass(e: MouseEvent): any {
      if (e.target instanceof Element) {
        e.target.classList.toggle("magnified");
      }
    },
  };

  applyClickHandlerToElementsMatchingSelector({
    selector: "img",
    onclick: clickHandlers.toggleGrowShrinkElement,
  });

  applyClickHandlerToElementsMatchingSelector({
    selector: ".ipa, ruby, code, q, cite, .term",
    onclick: clickHandlers.toggleMagnifiedClass,
  });

  addKeyEventHandlers: {
    document.addEventListener("keydown", (event) => {
      if (event.key === "u") {
        (
          document.querySelector(
            ".extra-info-button-section__button.show"
          ) as HTMLDivElement
        ).click();
      }
      // do something
    });
  }

  manipulateDOMBeforeAddingEventHandlers: {
    let elementFactory = {
      extraInfoButton(
        textLabel: string,
        onclick: (e: MouseEvent) => any
      ): HTMLDivElement {
        // Generates the general logic of all extra info buttons
        let button = document.createElement("div");
        [button.id, button.innerHTML] = [textLabel, textLabel];
        button.onclick = onclick;
        button.classList.add("extra-info-button-section__button", "show");
        return button;
      },
    };
    let DOMInserterFunctions = {
      appendToExtraInfoButtonSection(button: HTMLDivElement) {
        let extraInfoButtonSection = document.querySelector(
          ".extra-info-button-section"
        );
        if (!extraInfoButtonSection)
          throw new Error(
            "No extra info button section, but is in Anki template and thus must exist."
          );
        if (!extraInfoButtonSection.querySelector(`#${button.id}`)) {
          // if the button does not exist yet
          extraInfoButtonSection.append(button);
        }
      },
    };

    let furiganaList = document.querySelectorAll("rt");

    if (furiganaList.length > 0) {
      DOMInserterFunctions.appendToExtraInfoButtonSection(
        elementFactory.extraInfoButton("furi u", clickHandlers.showHideFurigana)
      );
    }
  }
}

/* <script id="canvas-script" src="_canvas.js"></script>
<script>
var loadModule = async () => {
  let hljs = await import("/_highlight.js");
   document.querySelectorAll('pre code').forEach((block) => {
hljs.highlightBlock(block);
});
  
};
loadModule();
</script>  implement logic for sketchpad, replacing a sketchpad token with it*/

document.body.style.display = "block"; // finally, show everything

var firstActiveCloze = document.querySelector(".c-active");
if (!firstActiveCloze) throw new Error("no active cloze in document");
firstActiveCloze.scrollIntoView(true);
if (!(window.innerHeight + window.scrollY >= document.body.scrollHeight)) {
  // you're not at the bottom of the page
  window.scrollBy(0, -100);
}
