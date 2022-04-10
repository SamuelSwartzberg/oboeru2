declare module "replacement-mapping.json" {
  const value: StructuredElementReplacementMap;
  export default value;
}

export interface StructuredElementReplacementMap {
  mdStyle: ElementReplacementMap;
  escapes: ElementReplacementMap;
  ebnf: ElementReplacementMap;
}
