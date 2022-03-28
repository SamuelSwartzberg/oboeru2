import { parseAndReencodeClozelikesWithResolvedNumbers } from "../card/ts/parsing/clozelike";
import fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd).toString();
const annotatedStdin = parseAndReencodeClozelikesWithResolvedNumbers(stdin);

let fusedStdin = [];
let [stdinLines, annotatedStdinLines] = [
  stdin.split("\n"),
  annotatedStdin.split("\n"),
];

for (let index = 0; index < stdinLines.length; index++) {
  let [stdinParts, annotatedStdinParts] = [
    stdinLines[index].split("⟮"),
    annotatedStdinLines[index].split(";"),
  ];
  let fusedLine = "";
  if (stdinParts.length === 1) fusedLine = stdinParts[0];
  else {
    fusedLine = annotatedStdinParts[0] + ";" + stdinParts.slice(1).join("⟮");
  }
  fusedStdin.push(fusedLine);
}

console.log(fusedStdin.join("\n"));
