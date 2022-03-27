export interface Section<T> {
  subsections: Subsection<T>[];
}

export interface Subsection<T> {
  lines: T[];
}
export type PossiblyCode =
  | {
      codetype: string | undefined;
    }
  | false;

export interface LineSpecifier {
  content: string;
  properties: {
    small: boolean;
    blockquote: boolean;
    "list-ordered": boolean;
    "list-unordered": boolean;
    groupShow: boolean;
    code: PossiblyCode;
    indentation: number;
  };
}
