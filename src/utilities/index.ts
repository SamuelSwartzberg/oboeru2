import { Command } from "commander";
import fs from "fs";
import { padTable } from "./tables";
const program = new Command();

program.option("--pad-table", "act as a filter padding a table");

const stdinData = fs.readFileSync(0, "utf-8");

let stdoutData = "";

if (program.padTable) {
  stdoutData = padTable(stdinData);
} else {
  stdoutData = "no operation specified.";
}

console.log(stdoutData);
