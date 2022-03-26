import { Cell, Row, Table } from "../globals"''
import { splitIntoActionMappingAndNonactionmapping } from "./split-into-action-mappings-and-nonspecifier";

export type Specifiers = {
  [key: string]: string;
};

var NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR = ",,,";

export function parseTable(tableString: string): Table<Specifiers> {
  const [specifier, ...nonspecifierUnjoined] = tableString.split(
    NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
  );
  const nonspecifier = nonspecifierUnjoined.join(
    NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
  );
  const [specifierObject, _] =
    splitIntoActionMappingAndNonactionmapping(specifier);
  const rows = nonspecifier.split("\n").map(parseRow);
  return {
    rows,
    specifier: specifierObject,
  };
}

function parseRow(rowString: string): Row<Specifiers> {
  const [specifier, ...nonspecifierUnjoined] = rowString.split(
    NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
  );
  const nonspecifier = nonspecifierUnjoined.join(
    NONCELL_SPECIFIER_NONSPECIFIER_SEPARATOR
  );
  const [specifierObject, _] =
    splitIntoActionMappingAndNonactionmapping(specifier);
  const cells = nonspecifier.split("\n").map(parseCell);
  return {
    specifier: specifierObject,
    cells,
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
