import fs from "fs";
import { makeTextContent } from "../ts/make-text-content";

// read the json file at MDECK/deck.json
let deckfile = "";
try {
  deckfile = fs.readFileSync(process.env.MDECK + "/deck.json", "utf8");
} catch (e) {
  console.log(
    "Error while trying to read the file. Perhaps env var is unset or file has moved?"
  );
  console.log(e);
  process.exit(1);
}

let deckfileAsJson: { [k: string]: any } = JSON.parse(deckfile);

// all the entries we care about are in the notes array

let notes: { [k: string]: any }[] = [];

if (deckfileAsJson.notes && Array.isArray(deckfileAsJson.notes)) {
  notes = deckfileAsJson.notes;
} else {
  console.log("No notes in deck.json");
  process.exit(1);
}

// for each entry in the notes array
// we take the first entry of the fields array
// we replace '\n' with actual newlines
// we create a key in a nested object according to the value of the tags field, where we nest more deeply for every :: in the tags field
// e.g. foo::bar::baz becomes { foo: { bar: { baz: { content: ... } } } }

type RecursiveObject = { [k: string]: RecursiveObject | string };

function isRecursiveObject(obj: any): obj is RecursiveObject {
  return typeof obj === "object" && obj !== null;
}

let views: RecursiveObject = {};

function addToViews(tags: string[], transformedContent: string) {
  let currentView: RecursiveObject | string = views;
  for (let tag of tags) {
    if (isRecursiveObject(currentView)) {
      if (!currentView[tag]) {
        currentView[tag] = {};
      }
      currentView = currentView[tag];
    }
  }
  if (isRecursiveObject(currentView)) {
    currentView.content = transformedContent;
  } else {
    console.log("Error: currentView is not an object");
    process.exit(1);
  }
}

for (let noteEntry of notes) {
  if (
    noteEntry.fields &&
    typeof noteEntry.fields[0] === "string" &&
    noteEntry.tags &&
    typeof noteEntry.tags === "string"
  ) {
    let entryContent = noteEntry.fields[0].replace(/\\n/g, "\n");
    let tags = noteEntry.tags.split(/::/);
    addToViews(tags, entryContent);
  } else {
    console.log("Note entry is not valid");
    process.exit(1);
  }
}

export default views;

/*makeTextContent({
      rawTags: noteEntry.tags,
      rawContent: entryContent,
    });*/
