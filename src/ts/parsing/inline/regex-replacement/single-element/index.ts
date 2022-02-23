interface ElementReplacement {
  match: string | RegExp;
  replacement: string;
}

interface ElementReplacementMap {
  [key: string]: ElementReplacement;
}

var elementReplacementMap: ElementReplacementMap = {
  ampersand: {
    match: "＆",
    replacement: "&amp;",
  },
};

export function getElementAndReplacement(): [RegExp | string, string][] {
  let keys = Object.keys(elementReplacementMap);
  let elementsForKey = keys.map((key: string) => elementReplacementMap[key]);
  let elemsAndReplacements: [RegExp | string, string][] = elementsForKey.map(
    (element: ElementReplacement) => {
      return [element.match, element.replacement];
    }
  );
  return elemsAndReplacements;
}
