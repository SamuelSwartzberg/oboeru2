import {
  TypeWithStringOrStringStringValueAndChildren,
  TypeWithStringOrStringStringValueAndChildrenCanAlsoBe,
} from "../2-tree-to-structured-tree/map-string-tree-to-structured-tree";

export function reduceTree<
  T extends TypeWithStringOrStringStringValueAndChildrenCanAlsoBe<T>
>(
  valueAndChildrenAndPotentiallyT:
    | T
    | TypeWithStringOrStringStringValueAndChildren,
  isTop: boolean,
  reducerFunc: (
    contents: T | TypeWithStringOrStringStringValueAndChildren,
    reducedValue: string
  ) => string
): string {
  if (valueAndChildrenAndPotentiallyT.children.length === 0) {
    if (Array.isArray(valueAndChildrenAndPotentiallyT.value)) {
      valueAndChildrenAndPotentiallyT.value =
        valueAndChildrenAndPotentiallyT.value.join("");
    }
    return reducerFunc(
      valueAndChildrenAndPotentiallyT,
      valueAndChildrenAndPotentiallyT.value
    );
  } else {
    if (isTop) {
      return valueAndChildrenAndPotentiallyT.children
        .map((child) => reduceTree(child, false, reducerFunc))
        .join("");
    } else {
      const reducedChildren = valueAndChildrenAndPotentiallyT.children.map(
        (child) => reduceTree(child, false, reducerFunc)
      );
      if (Array.isArray(valueAndChildrenAndPotentiallyT.value)) {
        const reducedValue =
          valueAndChildrenAndPotentiallyT.value[0] +
          reducedChildren.join("") +
          valueAndChildrenAndPotentiallyT.value[1];
        return reducerFunc(valueAndChildrenAndPotentiallyT, reducedValue);
      } else {
        throw new Error(
          "should not be possible for the value to not be an array"
        );
      }
    }
  }
}
