// Extrapolate probable programming languages from tags

var codeTypes = {
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

// set the global code type on body

for (codeType in codeTypes) {
  if (document.body.tags[0].includes(codeType)) {
    document.body.codeType = codeType;
    document.body.style.setProperty("--code-type", codeType);
  }
}

// Override the global code type based on attrs

document.querySelectorAll("pre code").forEach((block) => {
  let dataCodeType = block.dataset.codetype || document.body.codeType;
  if (!dataCodeType) return;
  let setManually = !!block.dataset.codetype;
  block.dataset.codetype = dataCodeType;
  block.dataset.displaycodetype = codeTypes[dataCodeType] || dataCodeType; // if we have an emoji, we want to display it
  let classCodeType;
  if (dataCodeType === "text" || dataCodeType === "regex")
    classCodeType = "plaintext";
  // makes sure that these get correct hljs class
  else classCodeType = dataCodeType;
  block.classList.add(
    classCodeType,
    "codetype-set",
    `codetype-set-${setManually ? "manually" : "fron-tags"}`
  );
});
