var languageEmojiMapping = {
  liquid: "💧",
  ruby: "🧧",
  rust: "🦀",
  perl: "🦪",
  lua: "🌙",
  markdown: "⬇️",
  md: "⬇️",
  py: "🐍",
  latex: "🖊️",
  js: "🟨",
  java: "☕",
  bash: "😇📟",
  sh: "📟",
  css: "🔷",
  html: "📙",
  http: "🔗",
  yaml: "📕",
  cs: "#️⃣",
  regex: "🔣",
  xml: "🟠",
  toml: "⬛",
  text: "📄",
  scss: "💮",
  ts: "🟦",
  react: "⚛️",
};

export function isLanguageInMapping(
  str: string
): str is keyof typeof languageEmojiMapping {
  return str in languageEmojiMapping;
}

export function getEmojiForLanguage(str: string): string {
  if (isLanguageInMapping(str)) {
    return languageEmojiMapping[str];
  } else return "missing emoji for language / language not registered";
}
