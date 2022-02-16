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
export function formatInlineLevel(htmlBlob: string): string {
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
