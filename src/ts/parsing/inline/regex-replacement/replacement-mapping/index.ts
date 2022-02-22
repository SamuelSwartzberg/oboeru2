import { keyReplacementFunction } from "./key";

export type TextWrapperHTMLWrapperMapEntryDelimSpecifier = {
  start: string;
  end: string;
};

export type TextWrapperHTMLWrapperMapEntry = {
  delimiters: RegExp | TextWrapperHTMLWrapperMapEntryDelimSpecifier;
  replacements:
    | TextWrapperHTMLWrapperMapEntryDelimSpecifier
    | ((substring: string, ...args: any[]) => string);
};

type TextWrapperHTMLWrapperMap = {
  [entry: string]: TextWrapperHTMLWrapperMapEntry;
};

export function isTextWrapperHTMLWrapperMapEntryDelimSpecifier(
  value: any
): value is TextWrapperHTMLWrapperMapEntryDelimSpecifier {
  return (
    typeof value === "object" &&
    value !== null &&
    "start" in value &&
    "end" in value
  );
}

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
  mdStyleDelCustom: {
    delimiters: {
      start: "〜",
      end: "〜",
    },
    replacements: {
      start: "<del>",
      end: "</del>",
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
  a: {
    delimiters: {
      start: "⇱",
      end: "⇲",
    },
    replacements: {
      start: "<a>",
      end: "</a>",
    },
  },
  img: {
    delimiters: {
      start: "✫",
      end: "✫",
    },
    replacements: {
      start: '<img src="',
      end: '"></img>',
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
  sub: {
    delimiters: {
      start: "⎵",
      end: "⎵",
    },
    replacements: {
      start: "<sub>",
      end: "</sub>",
    },
  },
  sup: {
    delimiters: {
      start: "⎴",
      end: "⎴",
    },
    replacements: {
      start: "<sup>",
      end: "</sup>",
    },
  },
  fakeAngleBracketEscape: {
    delimiters: {
      start: "‹",
      end: "›",
    },
    replacements: {
      start: "&lt;",
      end: "&gt;",
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
  kbd: {
    delimiters: {
      start: "⟦",
      end: "⟧",
    },
    replacements: keyReplacementFunction,
  },
  ruby: {
    delimiters: /(?<!\\)　(?<!\\)([^（]+)（([^）]+)(?<!\\)/g,
    replacements(_, rubyBottom: string, rubyTop: string): string {
      return `<ruby>${rubyBottom}<rp>（</rp><rt>${rubyTop}</rt><rp>）</rp></ruby>`;
    },
  },
};

export function getTextWrapperHTMLWrapperMap(): TextWrapperHTMLWrapperMap {
  return textWrapperHTMLWrapperMap;
}
