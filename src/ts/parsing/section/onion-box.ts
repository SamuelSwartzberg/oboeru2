/* 
function parseAsOnionBox(
  unparsedOnionBoxString: string,
  isGroupShow: boolean
): string {
  let onionBoxStructure = parseOnionBoxStructure(unparsedOnionBoxString);
  return `<section class="${
    !isGroupShow ? "cloze-group" : " "
  } section">${formatOnionBox(onionBoxStructure)}</section>`;
}

function formatOnionBox(onionBoxStructure) {
  let returnString = "";
  for (let [key, value] of Object.entries(onionBoxStructure)) {
    if (value === "leaf") {
      returnString += `<div class="onion-box"><span>${key}</span></div>`;
    } else {
      returnString += `<div class="onion-box"><span>${key}</span>${formatOnionBox(
        value
      )}</div>`;
    }
  }
  return returnString;
}

function parseOnionBoxStructure(unparsedOnionBoxString: string) {
  // an onion box is a nested box that uses labeled bracket notation to describe its layout
  let onionBox = {};
  let unparsedChildrenCharArray = [...unparsedOnionBoxString];
  let chainOfDepth = [];
  let label = "";
  let readingLabel = false;
  let currentLevel = onionBox;
  for (let currentChar of unparsedChildrenCharArray) {
    if (currentChar === "[") {
      label = "";
      readingLabel = true; // if we hit an open bracket, we need to start reading the label, any other actions can wait until we've read the label
    } else if (currentChar === "]") {
      if (readingLabel === true) {
        readingLabel = false;
        currentLevel[label] = "leaf";
        chainOfDepth.push(currentLevel);
      }
      chainOfDepth.pop();
      currentLevel = chainOfDepth[chainOfDepth.length - 1];
    } else if (currentChar === " " || currentChar === "\n" || currentChar === "\t") {
      // once we hit a space, we've finished reading the label, and we know there will be children
      readingLabel = false;
      // since we know there will be children, we need to prepare a new object, make that the current object and add it to the reference chain, and make the previous current object refer to the new object
      let newLevel = {};
      currentLevel[label] = newLevel;
      currentLevel = newLevel;
      chainOfDepth.push(currentLevel);
    } else if (readingLabel) {
      label += currentChar;
    }
  }
  return onionBox;
} */
