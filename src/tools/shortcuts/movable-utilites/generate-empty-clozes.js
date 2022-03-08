var fs = require("fs");
var amountOfClozes = fs.readFileSync(process.stdin.fd).toString();
let output = "";
for (let index = 1; index <= amountOfClozes; index++) {
  output += `{{c${index}::}}`;
}
console.log(output);
