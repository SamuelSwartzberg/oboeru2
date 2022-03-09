import { Command } from "commander";
import { padTable } from "./tables";
const program: Command = new Command();

program.option("--pad-table", "act as a filter padding a table");

const stdinData = process.stdin.read();

console.log(stdinData);

let stdoutData = "";

program.parse(process.argv);
const options = program.opts();

if (options.padTable) {
  stdoutData = padTable(stdinData);
} else {
  stdoutData = "no operation specified.";
}

console.log(stdoutData);
