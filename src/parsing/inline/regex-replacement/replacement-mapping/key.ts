var textToClassMap = {
  "⌘": "cmd",
  "⌥": "alt",
  "⊞": "win",
  "⇧": "shift",
  "⌃": "ctrl",
  fn: "fn",
};

function stringIsKeyOfTextToClassMap(str: string): str is keyof TextToClassMap {
  return Object.keys(textToClassMap).includes(str);
}

type TextToClassMap = typeof textToClassMap;

export function keyReplacementFunction(_: string, keyContents: string): string {
  if (stringIsKeyOfTextToClassMap(keyContents)) {
    return `<kbd class="modifier ${textToClassMap[keyContents]}"></kbd>`;
  } else return `<kbd>${keyContents}</kbd>`;
}
