export interface Section<T> {
  subsections: Subsection<T>[];
}

export interface Subsection<T> {
  lines: T[];
}

export interface LineSpecifier {
  content: string;
  properties: {
    small: boolean;
    blockquote: boolean;
    list: "ordered" | "unordered" | false;
    groupShow: boolean;
    code:
      | {
          codetype: string;
        }
      | false;
  };
}
