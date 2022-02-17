function parseAsTable(rawHTMLText: string, isGroupShow: boolean) {
  let tableSpec = parseSpecifiers(rawHTMLText, {
    nonspecifier: "",
    class: "",
    style: "",
    headerrows: "1",
  } as TableSpecifier);
  let headerrows: number = parseInt(tableSpec.headerrows, 10);
  if (isNaN(headerrows)) {
    headerrows = 1;
  }
  let rows: string[] = tableSpec.nonspecifier.split("\n");
  let [header, body] = [
    parseListOfRows(rows.slice(0, headerrows), "th").join("\n"),
    parseListOfRows(rows.slice(headerrows), "td").join("\n"),
  ];
  return `<table class="${!isGroupShow ? "cloze-group " : ""}${
    tableSpec.class
  } section" style="${
    tableSpec.style
  }"><thead>${header}</thead><tbody>${body}</tbody></table>`;
}

function parseListOfRows(
  listOfRows: string[],
  cellType: "th" | "td"
): string[] {
  return listOfRows.map((row) => parseRow(row, cellType));
}

function parseRow(row: string, cellType: "th" | "td"): string {
  let isGroupShow: boolean = false;
  if (row.startsWith("!")) {
    isGroupShow = true;
    row = row.slice(1);
  }
  return `<tr class="${!isGroupShow ? "cloze-group" : ""}">${row
    .split("|")
    .map((cell) => surroundCellByCellHTML(cell, cellType))
    .join("")}</tr>`;
}
