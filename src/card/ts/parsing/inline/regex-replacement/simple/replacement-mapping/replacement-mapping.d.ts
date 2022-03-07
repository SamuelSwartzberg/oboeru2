declare module "replacement-mapping.json" {
  const value: StructuredElementReplacementMap;
  export default value;
}

interface StructuredElementReplacementMap {
  mdStyle: ElementReplacementMap;
  escapes: ElementReplacementMap;
}
