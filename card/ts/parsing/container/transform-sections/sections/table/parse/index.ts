import log from "loglevel";
import { Cell, Row, Table } from "../globals";
import { splitIntoActionMappingAndNonactionmapping } from "./split-into-action-mappings-and-nonspecifier";

export type Specifiers = {
  [key: string]: string;
};

var NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR = ",,,";

export function parseTable(tableString: string): Table<Specifiers> {
  const parsedTableWithAbstractChildren = parseNoncell(
    tableString,
    "\n",
    parseRow
  );
  const parsedTable = {
    specifier: parsedTableWithAbstractChildren.specifier,
    rows: parsedTableWithAbstractChildren.children,
  };
  log.debug("The final parsed table is:");
  log.debug(JSON.stringify(parsedTable, null, 2));
  return parsedTable;
}

function parseRow(rowString: string): Row<Specifiers> {
  const parsedRowWithAbstractChildren = parseNoncell(rowString, "|", parseCell);
  const parsedRow = {
    specifier: parsedRowWithAbstractChildren.specifier,
    cells: parsedRowWithAbstractChildren.children,
  };
  return parsedRow;
}

type WithChildren<T> = {
  children: T[];
  specifier: Specifiers;
};

function parseNoncell<T>(
  str: string,
  splitter: string,
  callback: (str: string) => T
): WithChildren<T> {
  let nonspecifier: string;
  let specifierObj: Specifiers;
  let extraClasses: string = "";

  if (str.startsWith("!")) {
    str = str.slice(1);
  } else {
    extraClasses = "cloze-group";
  }

  log.debug("Parsing a string representing a table or row...");
  if (str.includes(NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR)) {
    log.debug("which had a specifier.");
    const [specifier, ...nonspecifierUnjoined] = str.split(
      NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
    );
    nonspecifier = nonspecifierUnjoined.join(
      NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
    );
    const [specifierObject, _] =
      splitIntoActionMappingAndNonactionmapping(specifier);
    specifierObj = specifierObject;
  } else {
    nonspecifier = str;
    specifierObj = {};
  }

  if (specifierObj.class && specifierObj.class.length > 0) {
    specifierObj.class = `${specifierObj.class} ${extraClasses}`;
  } else {
    specifierObj.class = extraClasses;
  }

  const children = nonspecifier.split(splitter).map(callback);
  return {
    children,
    specifier: specifierObj,
  };
}

function parseCell(cellString: string): Cell<Specifiers> {
  const [specifierObject, nonspecifier] =
    splitIntoActionMappingAndNonactionmapping(cellString);
  return {
    contents: nonspecifier,
    specifier: specifierObject,
  };
}
